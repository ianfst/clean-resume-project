// =====================================================
// LOCAL AUTH - Mock Supabase Auth
// =====================================================
// This provides a localStorage-based authentication system
// that mimics the Supabase auth API, allowing the app to
// run locally without any backend dependencies.
// =====================================================

export type User = {
    id: string;
    email: string;
    created_at: string;
    updated_at: string;
    user_metadata?: Record<string, any>;
};

export type Session = {
    user: User;
    access_token: string;
    refresh_token: string;
    expires_at: number;
};

type AuthChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED';
type AuthChangeCallback = (event: AuthChangeEvent, session: Session | null) => void;

class LocalAuth {
    private storageKey = 'local_auth_session';
    private usersKey = 'local_auth_users';
    private listeners: AuthChangeCallback[] = [];

    private getUsers(): Record<string, { email: string; password: string; user: User }> {
        const data = localStorage.getItem(this.usersKey);
        return data ? JSON.parse(data) : {};
    }

    private setUsers(users: Record<string, { email: string; password: string; user: User }>): void {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    private getSession(): Session | null {
        const data = localStorage.getItem(this.storageKey);
        if (!data) return null;

        const session = JSON.parse(data);

        // Check if session is expired
        if (session.expires_at < Date.now()) {
            this.clearSession();
            return null;
        }

        return session;
    }

    private setSession(session: Session): void {
        localStorage.setItem(this.storageKey, JSON.stringify(session));
    }

    private clearSession(): void {
        localStorage.removeItem(this.storageKey);
    }

    private notifyListeners(event: AuthChangeEvent, session: Session | null): void {
        this.listeners.forEach(callback => callback(event, session));
    }

    private createSession(user: User): Session {
        return {
            user,
            access_token: `local_token_${Date.now()}`,
            refresh_token: `local_refresh_${Date.now()}`,
            expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
        };
    }

    private generateUserId(): string {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Auth methods
    auth = {
        getSession: async (): Promise<{ data: { session: Session | null }; error: null }> => {
            const session = this.getSession();
            return { data: { session }, error: null };
        },

        getUser: async (): Promise<{ data: { user: User | null }; error: null }> => {
            const session = this.getSession();
            return { data: { user: session?.user || null }, error: null };
        },

        signUp: async (credentials: { email: string; password: string; options?: { data?: Record<string, any> } }) => {
            const users = this.getUsers();

            // Check if user already exists
            if (Object.values(users).some(u => u.email === credentials.email)) {
                return {
                    data: { user: null, session: null },
                    error: new Error('User already exists'),
                };
            }

            // Create new user
            const user: User = {
                id: this.generateUserId(),
                email: credentials.email,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                user_metadata: credentials.options?.data || {},
            };

            users[user.id] = {
                email: credentials.email,
                password: credentials.password, // In real app, this would be hashed
                user,
            };

            this.setUsers(users);

            // Create session
            const session = this.createSession(user);
            this.setSession(session);
            this.notifyListeners('SIGNED_IN', session);

            return {
                data: { user, session },
                error: null,
            };
        },

        signInWithPassword: async (credentials: { email: string; password: string }) => {
            const users = this.getUsers();
            const userEntry = Object.values(users).find(u => u.email === credentials.email);

            if (!userEntry || userEntry.password !== credentials.password) {
                return {
                    data: { user: null, session: null },
                    error: new Error('Invalid credentials'),
                };
            }

            // Create session
            const session = this.createSession(userEntry.user);
            this.setSession(session);
            this.notifyListeners('SIGNED_IN', session);

            return {
                data: { user: userEntry.user, session },
                error: null,
            };
        },

        signOut: async () => {
            this.clearSession();
            this.notifyListeners('SIGNED_OUT', null);

            return { error: null };
        },

        updateUser: async (updates: { email?: string; password?: string; data?: Record<string, any> }) => {
            const session = this.getSession();
            if (!session) {
                return {
                    data: { user: null },
                    error: new Error('Not authenticated'),
                };
            }

            const users = this.getUsers();
            const userEntry = users[session.user.id];

            if (!userEntry) {
                return {
                    data: { user: null },
                    error: new Error('User not found'),
                };
            }

            // Update user
            if (updates.email) {
                userEntry.email = updates.email;
                userEntry.user.email = updates.email;
            }
            if (updates.password) {
                userEntry.password = updates.password;
            }
            if (updates.data) {
                userEntry.user.user_metadata = {
                    ...userEntry.user.user_metadata,
                    ...updates.data,
                };
            }

            userEntry.user.updated_at = new Date().toISOString();
            users[session.user.id] = userEntry;
            this.setUsers(users);

            // Update session
            const newSession = this.createSession(userEntry.user);
            this.setSession(newSession);
            this.notifyListeners('USER_UPDATED', newSession);

            return {
                data: { user: userEntry.user },
                error: null,
            };
        },

        resetPasswordForEmail: async (email: string) => {
            // Mock password reset - in local mode, just log it
            console.log(`Password reset requested for: ${email}`);
            return { data: null, error: null };
        },

        onAuthStateChange: (callback: AuthChangeCallback) => {
            this.listeners.push(callback);

            // Immediately call with current session
            const session = this.getSession();
            if (session) {
                callback('SIGNED_IN', session);
            }

            return {
                data: {
                    subscription: {
                        unsubscribe: () => {
                            const index = this.listeners.indexOf(callback);
                            if (index > -1) {
                                this.listeners.splice(index, 1);
                            }
                        },
                    },
                },
            };
        },
    };
}

export const localAuth = new LocalAuth();
