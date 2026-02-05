// =====================================================
// LOCAL DATABASE - Mock Supabase Client
// =====================================================
// This provides a localStorage-based database that mimics
// the Supabase client API, allowing the app to run locally
// without any backend dependencies.
// =====================================================

type QueryFilter = {
    column: string;
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in';
    value: any;
};

type QueryBuilder = {
    filters: QueryFilter[];
    selectColumns: string | null;
    orderColumn: string | null;
    orderAscending: boolean;
    limitValue: number | null;
    singleResult: boolean;
};

class LocalDatabase {
    private storagePrefix = 'local_db_';

    private getTableKey(tableName: string): string {
        return `${this.storagePrefix}${tableName}`;
    }

    private getTable(tableName: string): any[] {
        const data = localStorage.getItem(this.getTableKey(tableName));
        return data ? JSON.parse(data) : [];
    }

    private setTable(tableName: string, data: any[]): void {
        localStorage.setItem(this.getTableKey(tableName), JSON.stringify(data));
    }

    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private applyFilters(data: any[], filters: QueryFilter[]): any[] {
        return data.filter(item => {
            return filters.every(filter => {
                const value = item[filter.column];
                switch (filter.operator) {
                    case 'eq':
                        return value === filter.value;
                    case 'neq':
                        return value !== filter.value;
                    case 'gt':
                        return value > filter.value;
                    case 'gte':
                        return value >= filter.value;
                    case 'lt':
                        return value < filter.value;
                    case 'lte':
                        return value <= filter.value;
                    case 'like':
                    case 'ilike':
                        return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
                    case 'in':
                        return Array.isArray(filter.value) && filter.value.includes(value);
                    default:
                        return true;
                }
            });
        });
    }

    from(tableName: string) {
        const builder: QueryBuilder = {
            filters: [],
            selectColumns: null,
            orderColumn: null,
            orderAscending: true,
            limitValue: null,
            singleResult: false,
        };

        const chainable = {
            select: (columns: string = '*') => {
                builder.selectColumns = columns;
                return chainable;
            },

            eq: (column: string, value: any) => {
                builder.filters.push({ column, operator: 'eq', value });
                return chainable;
            },

            neq: (column: string, value: any) => {
                builder.filters.push({ column, operator: 'neq', value });
                return chainable;
            },

            gt: (column: string, value: any) => {
                builder.filters.push({ column, operator: 'gt', value });
                return chainable;
            },

            gte: (column: string, value: any) => {
                builder.filters.push({ column, operator: 'gte', value });
                return chainable;
            },

            lt: (column: string, value: any) => {
                builder.filters.push({ column, operator: 'lt', value });
                return chainable;
            },

            lte: (column: string, value: any) => {
                builder.filters.push({ column, operator: 'lte', value });
                return chainable;
            },

            like: (column: string, value: any) => {
                builder.filters.push({ column, operator: 'like', value });
                return chainable;
            },

            ilike: (column: string, value: any) => {
                builder.filters.push({ column, operator: 'ilike', value });
                return chainable;
            },

            in: (column: string, values: any[]) => {
                builder.filters.push({ column, operator: 'in', value: values });
                return chainable;
            },

            order: (column: string, options?: { ascending?: boolean }) => {
                builder.orderColumn = column;
                builder.orderAscending = options?.ascending !== false;
                return chainable;
            },

            limit: (count: number) => {
                builder.limitValue = count;
                return chainable;
            },

            single: () => {
                builder.singleResult = true;
                return chainable;
            },

            maybeSingle: () => {
                builder.singleResult = true;
                return chainable;
            },

            insert: async (data: any | any[]) => {
                const records = Array.isArray(data) ? data : [data];
                const table = this.getTable(tableName);

                const newRecords = records.map(record => ({
                    ...record,
                    id: record.id || this.generateId(),
                    created_at: record.created_at || new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }));

                table.push(...newRecords);
                this.setTable(tableName, table);

                return {
                    data: Array.isArray(data) ? newRecords : newRecords[0],
                    error: null,
                };
            },

            update: async (data: any) => {
                const table = this.getTable(tableName);
                let filtered = this.applyFilters(table, builder.filters);

                filtered.forEach(item => {
                    Object.assign(item, data, { updated_at: new Date().toISOString() });
                });

                this.setTable(tableName, table);

                return {
                    data: filtered,
                    error: null,
                };
            },

            delete: async () => {
                const table = this.getTable(tableName);
                const filtered = this.applyFilters(table, builder.filters);
                const remaining = table.filter(item => !filtered.includes(item));

                this.setTable(tableName, remaining);

                return {
                    data: filtered,
                    error: null,
                };
            },

            upsert: async (data: any | any[]) => {
                const records = Array.isArray(data) ? data : [data];
                const table = this.getTable(tableName);

                records.forEach(record => {
                    const existingIndex = table.findIndex(item => item.id === record.id);

                    if (existingIndex >= 0) {
                        table[existingIndex] = {
                            ...table[existingIndex],
                            ...record,
                            updated_at: new Date().toISOString(),
                        };
                    } else {
                        table.push({
                            ...record,
                            id: record.id || this.generateId(),
                            created_at: record.created_at || new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        });
                    }
                });

                this.setTable(tableName, table);

                return {
                    data: records,
                    error: null,
                };
            },

            then: async (resolve: any) => {
                let data = this.getTable(tableName);

                // Apply filters
                if (builder.filters.length > 0) {
                    data = this.applyFilters(data, builder.filters);
                }

                // Apply ordering
                if (builder.orderColumn) {
                    data.sort((a, b) => {
                        const aVal = a[builder.orderColumn!];
                        const bVal = b[builder.orderColumn!];
                        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
                        return builder.orderAscending ? comparison : -comparison;
                    });
                }

                // Apply limit
                if (builder.limitValue !== null) {
                    data = data.slice(0, builder.limitValue);
                }

                // Apply single result
                if (builder.singleResult) {
                    data = data.length > 0 ? data[0] : null;
                }

                const result = { data, error: null };
                return resolve(result);
            },
        };

        return chainable;
    }

    // Storage methods
    storage = {
        from: (bucket: string) => ({
            upload: async (path: string, file: File) => {
                // Store file as base64 in localStorage
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64 = reader.result as string;
                        const storageKey = `${this.storagePrefix}storage_${bucket}_${path}`;
                        localStorage.setItem(storageKey, base64);

                        resolve({
                            data: { path, fullPath: `${bucket}/${path}` },
                            error: null,
                        });
                    };
                    reader.readAsDataURL(file);
                });
            },

            download: async (path: string) => {
                const storageKey = `${this.storagePrefix}storage_${bucket}_${path}`;
                const base64 = localStorage.getItem(storageKey);

                if (!base64) {
                    return { data: null, error: new Error('File not found') };
                }

                // Convert base64 back to blob
                const response = await fetch(base64);
                const blob = await response.blob();

                return { data: blob, error: null };
            },

            remove: async (paths: string[]) => {
                paths.forEach(path => {
                    const storageKey = `${this.storagePrefix}storage_${bucket}_${path}`;
                    localStorage.removeItem(storageKey);
                });

                return { data: null, error: null };
            },

            getPublicUrl: (path: string) => {
                const storageKey = `${this.storagePrefix}storage_${bucket}_${path}`;
                const base64 = localStorage.getItem(storageKey);

                return {
                    data: { publicUrl: base64 || '' },
                };
            },
        }),
    };

    // RPC (Remote Procedure Call) methods
    rpc = async (functionName: string, params?: any) => {
        // Mock RPC calls - can be extended as needed
        console.log(`RPC call to ${functionName} with params:`, params);

        return {
            data: null,
            error: null,
        };
    };

    // Realtime channel methods (mock implementation)
    channel = (channelName: string) => {
        return {
            on: (event: string, config: any, callback: any) => {
                // Mock realtime subscription - does nothing in local mode
                console.log(`Subscribed to channel: ${channelName}, event: ${event}`);
                return {
                    subscribe: () => {
                        console.log(`Channel ${channelName} subscribed`);
                        return { unsubscribe: () => { } };
                    },
                };
            },
            subscribe: () => {
                console.log(`Channel ${channelName} subscribed`);
                return { unsubscribe: () => { } };
            },
        };
    };

    removeChannel = (channel: any) => {
        // Mock channel removal
        console.log('Channel removed');
    };

    // Mock functions.invoke to call direct API instead
    functions = {
        invoke: async (functionName: string, options?: { body?: any }) => {
            console.log(`[LocalDB] Edge function called: ${functionName}`);

            // Get API key from environment or localStorage
            const apiKey = import.meta.env.VITE_OPENAI_API_KEY ||
                localStorage.getItem('openai_api_key') || '';

            if (!apiKey) {
                console.warn('[LocalDB] No API key configured. Set VITE_OPENAI_API_KEY in .env.local');
                return {
                    data: null,
                    error: new Error('API key not configured. Please set your OpenAI API key in .env.local')
                };
            }

            // Import API client dynamically to avoid circular dependencies
            const {
                parseResume,
                classifyJobDescription,
                extractJDRequirements,
                generateRoleBenchmark,
                analyzeResumeGaps,
                rewriteSection,
                generateHiringManagerCritique
            } = await import('@/lib/apiClient');

            try {
                const body = options?.body || {};

                // Route to appropriate API function based on function name
                switch (functionName) {
                    case 'parse-resume':
                        if (body.fileData && body.fileName) {
                            // Convert base64 to File object
                            const base64Data = body.fileData.split(',')[1] || body.fileData;
                            const binaryString = atob(base64Data);
                            const bytes = new Uint8Array(binaryString.length);
                            for (let i = 0; i < binaryString.length; i++) {
                                bytes[i] = binaryString.charCodeAt(i);
                            }
                            const blob = new Blob([bytes]);
                            const file = new File([blob], body.fileName);
                            const text = await parseResume(file);
                            return { data: { success: true, text }, error: null };
                        }
                        return { data: null, error: new Error('Missing file data') };

                    case 'rb-classify-jd':
                        if (body.jd_text) {
                            const result = await classifyJobDescription(body.jd_text, apiKey);
                            return { data: result, error: null };
                        }
                        return { data: null, error: new Error('Missing jd_text') };

                    case 'rb-extract-jd-requirements':
                    case 'extract-jd-requirements':
                        if (body.jd_text || body.jobDescription) {
                            const jdText = body.jd_text || body.jobDescription;
                            const result = await extractJDRequirements(jdText, apiKey);
                            return { data: result, error: null };
                        }
                        return { data: null, error: new Error('Missing job description') };

                    case 'rb-generate-benchmark':
                    case 'generate-role-benchmark':
                        if (body.role_title && body.seniority_level && body.industry) {
                            const result = await generateRoleBenchmark(
                                body.role_title,
                                body.seniority_level,
                                body.industry,
                                apiKey
                            );
                            return { data: result, error: null };
                        }
                        return { data: null, error: new Error('Missing role information') };

                    case 'analyze-resume-gaps':
                        if (body.resume_text && body.requirements) {
                            const result = await analyzeResumeGaps(
                                body.resume_text,
                                body.requirements,
                                body.benchmark || {},
                                apiKey
                            );
                            return { data: result, error: null };
                        }
                        return { data: null, error: new Error('Missing resume or requirements') };

                    case 'rb-rewrite-section':
                        if (body.section_name && body.original_content) {
                            const result = await rewriteSection(
                                body.section_name,
                                body.original_content,
                                body.target_role || '',
                                body.requirements || [],
                                apiKey
                            );
                            return { data: { rewritten_content: result }, error: null };
                        }
                        return { data: null, error: new Error('Missing section data') };

                    case 'rb-hiring-manager-critique':
                        if (body.resume_content && body.job_description) {
                            const result = await generateHiringManagerCritique(
                                body.resume_content,
                                body.job_description,
                                apiKey
                            );
                            return { data: result, error: null };
                        }
                        return { data: null, error: new Error('Missing resume or job description') };

                    default:
                        console.warn(`[LocalDB] Unimplemented edge function: ${functionName}`);
                        return {
                            data: null,
                            error: new Error(`Function "${functionName}" not implemented in local mode`)
                        };
                }
            } catch (error: any) {
                console.error(`[LocalDB] Error calling ${functionName}:`, error);
                return {
                    data: null,
                    error: error instanceof Error ? error : new Error(String(error))
                };
            }
        }
    };
}

export const localDb = new LocalDatabase();
