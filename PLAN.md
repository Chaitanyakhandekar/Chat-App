# Infinite Scroll / Message Pagination Plan

## Overview
Implement paginated message loading so that only 30 messages load initially, and older messages are fetched automatically when the user scrolls to the top.

---

## 1. Backend: Add Pagination to `getConversation` (Single Chat)

**File:** `server/src/controllers/message.controller.js` (lines 26-70)

- Parse `page` (default 1) and `limit` (default 30) from `req.query`
- Add `.sort({ createdAt: -1 })` to get newest messages first
- Add `.skip((page - 1) * limit).limit(limit)` for pagination
- Return `hasMore` flag: `count > page * limit`
- Response shape: `{ messages: [...], hasMore: boolean, page: number }`

## 2. Backend: Add Pagination to `getGroupConversation`

**File:** `server/src/controllers/message.controller.js` (lines 79-109)

- Same pagination params: `page`, `limit`
- Add `.sort({ createdAt: -1 })`, `.skip()`, `.limit()`
- Return `hasMore` flag

## 3. Frontend API: Update `messageApi.getConversation`

**File:** `client/src/api/message.api.js` (lines 8-31)

- Accept optional `{ page, limit }` params
- Pass as query params: `?page=1&limit=30`
- Return `{ data, hasMore, page }` in response

## 4. Frontend API: Update `groupApi.getConversation`

**File:** `client/src/api/group.api.js` (lines 72-95)

- Same changes: accept `{ page, limit }`, return `{ data, hasMore, page }`

## 5. Zustand Store: Add `prependMessages` + Pagination State

**File:** `client/src/store/useChatStore.js`

Add new state/action:
- `chatPagination: {}` — keyed by chatId, stores `{ page, hasMore, isLoadingOlder }`
- `prependMessages(chatId, olderMessages)` — prepends messages to beginning of array
- `setChatPagination(chatId, paginationData)` — updates pagination state

## 6. Frontend: Update `applyChatFromData` in Chat.jsx

**File:** `client/src/pages/user/Chat.jsx` (lines 419-449)

- Call `getConversation` with `{ page: 1, limit: 30 }`
- Store initial pagination state `{ page: 1, hasMore: true, isLoadingOlder: false }`
- Store messages via `setUserMessages`

## 7. Frontend: Implement Scroll-to-Top Detection in Chat.jsx

**File:** `client/src/pages/user/Chat.jsx`

- In the scroll listener (line 610), detect when `scrollTop === 0` (user scrolled to top)
- When at top AND `hasMore` is true AND not already loading:
  - Set `isLoadingOlder = true`
  - Save current `scrollHeight` and `scrollTop` for position preservation
  - Fetch next page: `getConversation({ page: currentPage + 1, limit: 30 })`
  - Prepend older messages via `prependMessages`
  - Restore scroll position: `scrollTop = newScrollHeight - oldScrollHeight + oldScrollTop`
  - Update pagination state

## 8. Frontend: Add Loading Spinner in Chat.jsx

**File:** `client/src/pages/user/Chat.jsx` (inside messages div, line 1032)

- Show a small loading spinner at the top of the messages list when `isLoadingOlder` is true
- Messages render below the spinner

---

## Files to Modify (7 files)

| # | File | Change |
|---|------|--------|
| 1 | `server/src/controllers/message.controller.js` | Add pagination to `getConversation` and `getGroupConversation` |
| 2 | `client/src/api/message.api.js` | Accept page/limit params, return hasMore |
| 3 | `client/src/api/group.api.js` | Accept page/limit params, return hasMore |
| 4 | `client/src/store/useChatStore.js` | Add `prependMessages`, `chatPagination`, `setChatPagination` |
| 5 | `client/src/pages/user/Chat.jsx` | Scroll-to-top detection, fetch older, loading spinner, position preservation |

## Key Design Decisions

- **Page size:** 30 messages per page (consistent with `getMessagesForSummary` limit)
- **Sort order:** Newest first (descending `createdAt`), so initial load shows latest messages
- **Scroll position preservation:** Save `scrollHeight`/`scrollTop` before prepend, restore after DOM update
- **No infinite scroll library:** Custom implementation using native scroll event + `scrollTop === 0` detection
- **Backward compatible:** If no `page`/`limit` params sent, backend returns all messages (graceful fallback)
