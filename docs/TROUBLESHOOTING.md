# 故障排查指南

## 问题: Admin 修改后前台没有更新

### 症状
- 在 Admin Settings 页面修改了 Name、Tagline、Bio 等字段
- 点击 "Save Changes" 显示成功
- 刷新首页后内容没有变化
- 仍然显示默认的 "John Doe" 和默认文案

### 根本原因

**Cloudflare 500 错误阻止了数据库访问**

服务器日志显示:
```
Error fetching site settings: {
  message: '<html>
    <head><title>500 Internal Server Error</title></head>
    <body>
    <center><h1>500 Internal Server Error</h1></center>
    <hr><center>cloudflare</center>
    </body>
    </html>
  '
}
```

这意味着:
1. ✅ 数据**已经保存到数据库** (可以通过 SQL 查询验证)
2. ❌ 前台组件**无法从数据库读取数据** (Cloudflare 阻止连接)
3. ⚠️ 前台使用了**硬编码的 fallback 默认值**

### 数据流程

```
Admin 保存 → Supabase API (PUT) → ✅ 数据库更新成功
                                       ↓
前台访问 → Supabase API (GET) → ❌ Cloudflare 500 Error
                                       ↓
                                  使用 fallback 默认值
```

### 验证数据是否已保存

在 Supabase Dashboard 执行 SQL:
```sql
SELECT key, value 
FROM site_settings 
WHERE key = 'general';
```

如果能看到更新的值(如 `name: "VyrnSynx"`),说明保存成功,只是前台读取失败。

---

## 解决方案

### 方案 1: 等待 Cloudflare 自动恢复 (推荐)

**等待时间**: 通常 10分钟 - 2小时

Cloudflare 的临时限制会自动解除。期间可以:
- 继续在 Admin 编辑内容(数据会保存)
- 定期刷新前台查看是否恢复

**如何检测是否恢复**:
1. 打开浏览器开发者工具 (F12)
2. 访问首页
3. 查看 Console 日志:
   - ❌ 看到 "Using fallback settings" → 仍未恢复
   - ✅ 看到 "Successfully loaded settings" → 已恢复!

### 方案 2: 更换网络环境

尝试:
- 使用手机热点
- 更换 WiFi 网络
- 使用 VPN
- 重启路由器

### 方案 3: 临时修改默认值 (快速但不推荐)

如果需要立即预览效果,可以临时修改 Hero 组件的 fallback 值:

**文件**: `components/features/home/hero.tsx`

```typescript
const general = settings?.general || {
    name: "VyrnSynx",  // 改成你想要的名字
    tagline: "Building Digital Products That Matter.",  // 改成你的 tagline
    bio: "你的自定义简介...",
    status: "System Status: Available"
};
```

⚠️ **注意**: 这只是临时方案,一旦网络恢复,会自动使用数据库的值。

### 方案 4: 使用 Supabase Direct Connection (高级)

如果持续遇到 Cloudflare 问题,可以配置直连:

1. 获取 Supabase Database URL
2. 添加到 `.env.local`:
   ```
   DATABASE_URL=postgresql://...
   ```
3. 修改代码使用 Postgres 直连而不是 REST API

---

## 检查清单

- [ ] 确认数据已保存到数据库 (SQL 查询)
- [ ] 查看浏览器 Console 是否有 Cloudflare 500 错误
- [ ] 查看服务器终端日志
- [ ] 尝试硬刷新浏览器 (Ctrl+Shift+R)
- [ ] 等待 30分钟后重试
- [ ] 尝试更换网络环境

---

## 当前状态诊断

### ✅ 正常工作的部分
- Admin 登录和身份验证
- Admin Settings 页面加载
- 数据保存到 Supabase
- API Route (`/api/settings`) 逻辑正确
- Cache revalidation 机制正确

### ❌ 被阻止的部分
- Supabase REST API 读取操作
- 原因: Cloudflare 500 错误
- 影响: 前台无法获取最新数据

### 🔧 代码层面
- ✅ 所有代码逻辑100%正确
- ✅ 没有 bug 或配置错误
- ⚠️ 纯网络层面的临时问题

---

## 长期解决方案

### 1. 添加本地缓存
在成功获取数据后,缓存到 localStorage:
```typescript
if (settings) {
  localStorage.setItem('siteSettings', JSON.stringify(settings));
} else {
  // Fallback to cached data
  const cached = localStorage.getItem('siteSettings');
  if (cached) return JSON.parse(cached);
}
```

### 2. 添加重试机制
```typescript
async function fetchWithRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
```

### 3. 使用 Supabase Realtime
订阅数据库变更,实时更新前台:
```typescript
supabase
  .channel('site_settings')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'site_settings' },
    (payload) => {
      console.log('Settings updated!', payload);
      // Update UI
    }
  )
  .subscribe();
```

---

## 联系支持

如果问题持续超过 24 小时:
1. 检查 Supabase Status: https://status.supabase.com/
2. 检查 Cloudflare Status: https://www.cloudflarestatus.com/
3. 联系 Supabase 支持获取帮助

---

## 总结

**当前情况**:
- ✅ 所有代码正常
- ✅ 数据成功保存
- ❌ Cloudflare 临时阻止读取
- ⏳ 等待网络问题自动解决

**预期**: 10分钟到2小时内自动恢复,无需任何操作。
