# Deployment Guide

**Project:** Always-On Contracts (Evidence-Based Resume Builder)  
**Last Updated:** February 3, 2026

---

## 🚀 Quick Deploy

This is a Lovable.dev project with automatic deployment:

1. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Lovable automatically:**
   - Detects changes
   - Deploys edge functions to Supabase
   - Updates production site

3. **Verify deployment:**
   - Check Lovable dashboard for status
   - Test changes in production

---

## 📋 Pre-Deployment Checklist

Before deploying:

- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run lint`
- [ ] Environment variables configured in Supabase
- [ ] Database migrations applied (if any)
- [ ] Edge functions tested locally

---

## 🔧 Deployment Options

### Option 1: Auto-Deploy via Lovable (RECOMMENDED)

**Best for:** Regular updates, feature releases

```bash
git add .
git commit -m "feat: your feature description"
git push origin main
```

Lovable will automatically:
- Deploy edge functions to Supabase
- Update frontend on CDN
- Apply database migrations
- Restart services if needed

**Deployment time:** 2-5 minutes

---

### Option 2: Manual Supabase Edge Function Deploy

**Best for:** Hotfixes, edge function updates only

```bash
# Install Supabase CLI (if needed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref ubcghjlfxkamyyefnbkf

# Deploy specific function
supabase functions deploy <function-name>

# Or deploy all functions
supabase functions deploy
```

---

### Option 3: Supabase Dashboard Manual Deploy

**Best for:** Emergency fixes, testing

1. Go to https://supabase.com/dashboard
2. Select project: `ubcghjlfxkamyyefnbkf`
3. Navigate to Edge Functions
4. Select function to update
5. Paste new code
6. Click "Deploy"

---

## 🔐 Environment Variables

Required in Supabase Dashboard → Settings → Vault:

| Variable | Required | Purpose |
|----------|----------|---------|
| `LOVABLE_API_KEY` | ✅ YES | AI matching via Lovable-Gemini |
| `SUPABASE_URL` | ✅ YES | Database connection |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ YES | Database admin access |
| `PERPLEXITY_API_KEY` | ⚠️ OPTIONAL | Job analysis features |

**Frontend variables** (auto-configured by Lovable):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

---

## 🧪 Post-Deployment Testing

### Quick Smoke Test (5 minutes)

1. **Test Authentication:**
   - Login/logout works
   - Protected routes redirect correctly

2. **Test Core Features:**
   - Career Vault onboarding
   - Resume Builder
   - Job Search
   - LinkedIn tools

3. **Check Browser Console:**
   - No JavaScript errors
   - No failed network requests
   - No TypeScript warnings

4. **Verify Edge Functions:**
   - Check Supabase logs for errors
   - Test AI-powered features
   - Verify database queries work

### Expected Results

✅ All pages load without errors  
✅ Authentication works  
✅ Database queries succeed  
✅ Edge functions respond in <10s  
✅ No console errors  
✅ UI renders correctly  

---

## 🔄 Rollback Plan

If deployment causes issues:

### Quick Rollback via Git

```bash
# Revert last commit
git revert HEAD
git push origin main

# Or rollback to specific commit
git reset --hard <commit-hash>
git push origin main --force
```

### Rollback Edge Function via Supabase

1. Go to Supabase Dashboard
2. Navigate to Edge Functions
3. Select function
4. Click "Version History"
5. Select previous version
6. Click "Restore and Deploy"

---

## 📊 Monitoring

After deployment, monitor:

1. **Supabase Logs:**
   - Dashboard → Logs
   - Filter by function name
   - Watch for errors/warnings

2. **Error Tracking:**
   - Check Sentry (if configured)
   - Monitor browser console errors
   - Review user feedback

3. **Performance:**
   - Edge function response times
   - Database query performance
   - Page load times

---

## 🚨 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Edge Function Errors

1. Check Supabase logs
2. Verify environment variables
3. Test function locally
4. Check TypeScript types

### Database Issues

1. Verify migrations applied
2. Check RLS policies
3. Verify service role key
4. Test queries in SQL editor

---

## 📝 Deployment History

Track major deployments:

| Date | Version | Changes | Deployed By |
|------|---------|---------|-------------|
| 2026-02-03 | cleanup/20260203 | Removed 49 archived files, unused components | System |
| 2025-01-05 | Phase 10 | All 7 features working | Team |

---

## 🔗 Related Documentation

- [Testing Guide](TESTING.md)
- [API Setup Guide](API_SETUP_GUIDE.md)
- [Rollback Plan](ROLLBACK_PLAN.md)
- [Key Rotation Instructions](KEY_ROTATION_INSTRUCTIONS.md)

---

## 📞 Support

For deployment issues:

1. Check Supabase logs first
2. Review this guide
3. Check Lovable dashboard
4. Contact team lead

---

**Ready to deploy!** 🚀
