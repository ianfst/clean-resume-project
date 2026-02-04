# Testing Guide

**Project:** Always-On Contracts (Evidence-Based Resume Builder)  
**Last Updated:** February 3, 2026

---

## 🚀 Quick Start

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Build project (validates TypeScript)
npm run build
```

---

## 🧪 Manual Testing Checklist

### 1. Authentication Flow
- [ ] Sign up with new account
- [ ] Login with existing account
- [ ] Logout
- [ ] Password reset
- [ ] Protected routes redirect to login

### 2. Career Vault / Master Resume
- [ ] Upload resume (PDF/DOCX/TXT)
- [ ] AI auto-population extracts 100-200+ items
- [ ] Review interface shows extracted intelligence
- [ ] Can approve/edit/skip items
- [ ] Voice notes recording works (Chrome/Edge/Safari)
- [ ] Dashboard shows completion percentage (85%+)
- [ ] All 10 vault tables populated

**Verify in Database:**
```sql
SELECT 
  (SELECT COUNT(*) FROM vault_power_phrases WHERE vault_id = 'YOUR_VAULT_ID') as power_phrases,
  (SELECT COUNT(*) FROM vault_transferable_skills WHERE vault_id = 'YOUR_VAULT_ID') as skills,
  (SELECT COUNT(*) FROM vault_hidden_competencies WHERE vault_id = 'YOUR_VAULT_ID') as competencies,
  (SELECT COUNT(*) FROM vault_soft_skills WHERE vault_id = 'YOUR_VAULT_ID') as soft_skills,
  (SELECT COUNT(*) FROM vault_leadership_philosophy WHERE vault_id = 'YOUR_VAULT_ID') as leadership,
  (SELECT COUNT(*) FROM vault_executive_presence WHERE vault_id = 'YOUR_VAULT_ID') as executive_presence,
  (SELECT COUNT(*) FROM vault_personality_traits WHERE vault_id = 'YOUR_VAULT_ID') as personality,
  (SELECT COUNT(*) FROM vault_work_style WHERE vault_id = 'YOUR_VAULT_ID') as work_style,
  (SELECT COUNT(*) FROM vault_values_motivations WHERE vault_id = 'YOUR_VAULT_ID') as values,
  (SELECT COUNT(*) FROM vault_behavioral_indicators WHERE vault_id = 'YOUR_VAULT_ID') as behavioral;
```

### 3. Resume Builder
- [ ] Create new resume for job posting
- [ ] Job analysis extracts requirements
- [ ] Vault matching shows relevant items
- [ ] Can add vault items to resume sections
- [ ] Executive summary includes leadership philosophy
- [ ] Skills section includes soft skills
- [ ] Export to PDF/DOCX works
- [ ] Resume score calculated correctly

### 4. LinkedIn Tools
- [ ] **Profile Builder:** Optimizes headline, about, skills
- [ ] **Blog Topics:** Generates 5 topics from vault data
- [ ] **Series Planner:** Creates 4/8/12/16 part series
- [ ] **Post Composer:** Drafts LinkedIn posts
- [ ] All features use all 10 vault categories

### 5. Interview Prep
- [ ] Select job from projects
- [ ] Elevator pitch builder works
- [ ] 30-60-90 day plan generator works
- [ ] 3-2-1 framework generates questions
- [ ] STAR story generator uses vault data
- [ ] Company research panel works
- [ ] Questions cover technical + soft skills + leadership

### 6. Job Search
- [ ] Search for jobs by keyword
- [ ] Filter by location, salary, type
- [ ] Vault matching shows compatibility scores
- [ ] Can save jobs
- [ ] Can apply to jobs
- [ ] Application queue tracks status

### 7. Networking Agent
- [ ] Generate networking email
- [ ] Email includes vault context (achievements, skills)
- [ ] Contact management displays
- [ ] Follow-up tracking works

---

## 🎯 Test Scenarios

### Scenario 1: Executive with 20 Years Experience
**Resume:** Senior VP, Fortune 500, P&L responsibility

**Expected Results:**
- 150-200+ vault items extracted
- High confidence scores (85-95%)
- Strong leadership philosophy
- Executive presence indicators
- Resume strength score: 85-95

### Scenario 2: Mid-Career Professional (10 Years)
**Resume:** Manager/Director level

**Expected Results:**
- 100-150 vault items extracted
- Medium-high confidence (75-85%)
- Good transferable skills
- Emerging leadership
- Resume strength score: 70-85

### Scenario 3: Career Changer
**Resume:** Switching industries/roles

**Expected Results:**
- AI identifies hidden competencies
- Transferable skills highlighted
- 80-120 vault items extracted
- Resume strength score: 65-80

---

## ⚡ Performance Testing

### Response Time Targets

| Operation | Target | Acceptable |
|-----------|--------|------------|
| Vault data fetch | <200ms | <500ms |
| LinkedIn topic generation | <3s | <5s |
| Resume generation | <5s | <10s |
| Job analysis | <5s | <10s |
| Interview question generation | <3s | <5s |

### Load Testing

Test with:
- Sparse vault data (10-20 items)
- Normal vault data (100-200 items)
- Rich vault data (500+ items)

**Expected:** No timeouts, graceful degradation

---

## 🐛 Edge Cases

### Test: Sparse Vault Data
1. Create new user
2. Upload minimal resume (1 page)
3. Try all features

**Expected:** No crashes, helpful messages when vault incomplete

### Test: Missing AI API Key
1. Temporarily disable API key
2. Try AI-powered features

**Expected:** Graceful error messages, fallback to keyword matching

### Test: Large Resume (10+ Pages)
1. Upload very long resume
2. Check extraction performance

**Expected:** Handles large documents, may take longer but doesn't timeout

### Test: Non-English Resume
1. Upload resume in another language

**Expected:** Graceful error or best-effort extraction

---

## 🔍 Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Edge (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)

**Voice features:** Chrome/Edge/Safari only (Firefox may not work)

---

## 📊 Success Metrics

After testing, verify:

✅ **All 10 vault tables populated** after resume upload  
✅ **LinkedIn features use all 10 tables**  
✅ **Interview prep uses all 10 tables**  
✅ **Resume generation uses all 10 tables**  
✅ **Job matching uses all 10 tables**  
✅ **Performance acceptable** (<5s for most operations)  
✅ **No regressions** in existing features  
✅ **Graceful error handling** for edge cases  

---

## 🚨 Common Issues & Solutions

### Issue: "AI extraction failed"
**Cause:** Supabase function not deployed

**Solution:**
```bash
supabase functions deploy auto-populate-vault
```

### Issue: "Microphone access denied"
**Cause:** Browser blocked permission

**Solution:**
1. Click lock icon in address bar
2. Allow microphone access
3. Refresh page

### Issue: "No vault matches found"
**Cause:** Vault not populated or job description too vague

**Solution:**
- Complete Career Vault onboarding first
- Use more detailed job description

### Issue: Build fails
**Cause:** TypeScript errors or missing dependencies

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🔗 Related Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [API Setup Guide](API_SETUP_GUIDE.md)
- [Feature Guide](QUICK_FEATURE_GUIDE.md)

---

## 📝 Reporting Issues

When reporting bugs:

1. **Describe the issue:** What happened vs what should happen
2. **Steps to reproduce:** Exact steps to trigger the bug
3. **Browser console:** Any errors in console (F12)
4. **Network tab:** Failed requests or slow responses
5. **Supabase logs:** Edge function errors
6. **Environment:** Browser, OS, user role

---

## 🎉 Automated Testing (Future)

Consider adding:
- Playwright E2E tests for critical flows
- Unit tests for utility functions
- Integration tests for edge functions
- Performance benchmarks in CI/CD
- Visual regression testing

---

**Ready to test!** 🧪
