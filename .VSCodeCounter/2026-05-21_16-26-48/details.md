# Details

Date : 2026-05-21 16:26:48

Directory f:\\Coding\\MERN Stack\\Backend\\Websockets\\Chat App

Total : 144 files,  20922 codes, 826 comments, 2298 blanks, all 24046 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [README.md](/README.md) | Markdown | 144 | 1 | 45 | 190 |
| [client/README.md](/client/README.md) | Markdown | 9 | 0 | 8 | 17 |
| [client/eslint.config.js](/client/eslint.config.js) | JavaScript | 28 | 0 | 2 | 30 |
| [client/index.html](/client/index.html) | HTML | 14 | 0 | 1 | 15 |
| [client/package-lock.json](/client/package-lock.json) | JSON | 4,450 | 0 | 1 | 4,451 |
| [client/package.json](/client/package.json) | JSON | 39 | 0 | 1 | 40 |
| [client/postcss.config.js](/client/postcss.config.js) | JavaScript | 6 | 0 | 1 | 7 |
| [client/public/vite.svg](/client/public/vite.svg) | XML | 1 | 0 | 0 | 1 |
| [client/src/App.css](/client/src/App.css) | PostCSS | 0 | 0 | 1 | 1 |
| [client/src/App.jsx](/client/src/App.jsx) | JavaScript JSX | 59 | 2 | 14 | 75 |
| [client/src/api/chat.api.js](/client/src/api/chat.api.js) | JavaScript | 135 | 0 | 21 | 156 |
| [client/src/api/group.api.js](/client/src/api/group.api.js) | JavaScript | 239 | 3 | 39 | 281 |
| [client/src/api/message.api.js](/client/src/api/message.api.js) | JavaScript | 139 | 0 | 19 | 158 |
| [client/src/api/notification.api.js](/client/src/api/notification.api.js) | JavaScript | 40 | 0 | 9 | 49 |
| [client/src/api/request.api.js](/client/src/api/request.api.js) | JavaScript | 74 | 0 | 13 | 87 |
| [client/src/api/user.api.js](/client/src/api/user.api.js) | JavaScript | 177 | 2 | 19 | 198 |
| [client/src/assets/react.svg](/client/src/assets/react.svg) | XML | 1 | 0 | 0 | 1 |
| [client/src/components/guards/ProtectedRoute.jsx](/client/src/components/guards/ProtectedRoute.jsx) | JavaScript JSX | 12 | 0 | 7 | 19 |
| [client/src/components/guards/ProtectedRouteAuth.jsx](/client/src/components/guards/ProtectedRouteAuth.jsx) | JavaScript JSX | 12 | 0 | 5 | 17 |
| [client/src/components/message/FileUpload.jsx](/client/src/components/message/FileUpload.jsx) | JavaScript JSX | 94 | 0 | 12 | 106 |
| [client/src/components/message/MediaPreview.jsx](/client/src/components/message/MediaPreview.jsx) | JavaScript JSX | 194 | 9 | 19 | 222 |
| [client/src/components/message/Message.jsx](/client/src/components/message/Message.jsx) | JavaScript JSX | 831 | 42 | 68 | 941 |
| [client/src/components/message/MessageInfoModel.jsx](/client/src/components/message/MessageInfoModel.jsx) | JavaScript JSX | 138 | 7 | 10 | 155 |
| [client/src/components/message/SingleFilePreview.jsx](/client/src/components/message/SingleFilePreview.jsx) | JavaScript JSX | 100 | 6 | 13 | 119 |
| [client/src/components/user/ChatCard.jsx](/client/src/components/user/ChatCard.jsx) | JavaScript JSX | 214 | 22 | 23 | 259 |
| [client/src/components/user/ChatList.jsx](/client/src/components/user/ChatList.jsx) | JavaScript JSX | 129 | 10 | 16 | 155 |
| [client/src/components/user/ChatWindow.jsx](/client/src/components/user/ChatWindow.jsx) | JavaScript JSX | 161 | 8 | 20 | 189 |
| [client/src/components/user/CreateGroup.jsx](/client/src/components/user/CreateGroup.jsx) | JavaScript JSX | 87 | 0 | 13 | 100 |
| [client/src/components/user/GroupInfo.jsx](/client/src/components/user/GroupInfo.jsx) | JavaScript JSX | 647 | 75 | 80 | 802 |
| [client/src/components/user/Notification.jsx](/client/src/components/user/Notification.jsx) | JavaScript JSX | 187 | 77 | 56 | 320 |
| [client/src/components/user/NotificationCard.jsx](/client/src/components/user/NotificationCard.jsx) | JavaScript JSX | 306 | 40 | 20 | 366 |
| [client/src/components/user/Profile.jsx](/client/src/components/user/Profile.jsx) | JavaScript JSX | 407 | 16 | 36 | 459 |
| [client/src/components/user/Settings.jsx](/client/src/components/user/Settings.jsx) | JavaScript JSX | 32 | 0 | 7 | 39 |
| [client/src/constants/socketEvents.js](/client/src/constants/socketEvents.js) | JavaScript | 32 | 0 | 1 | 33 |
| [client/src/context/AuthProvider.jsx](/client/src/context/AuthProvider.jsx) | JavaScript JSX | 18 | 0 | 7 | 25 |
| [client/src/hooks/useGroup.jsx](/client/src/hooks/useGroup.jsx) | JavaScript JSX | 36 | 0 | 7 | 43 |
| [client/src/hooks/useNotification.jsx](/client/src/hooks/useNotification.jsx) | JavaScript JSX | 41 | 0 | 9 | 50 |
| [client/src/hooks/useRequest.jsx](/client/src/hooks/useRequest.jsx) | JavaScript JSX | 52 | 6 | 16 | 74 |
| [client/src/index.css](/client/src/index.css) | PostCSS | 8 | 0 | 1 | 9 |
| [client/src/main.jsx](/client/src/main.jsx) | JavaScript JSX | 17 | 0 | 3 | 20 |
| [client/src/pages/auth/Login.jsx](/client/src/pages/auth/Login.jsx) | JavaScript JSX | 98 | 11 | 17 | 126 |
| [client/src/pages/auth/Register.jsx](/client/src/pages/auth/Register.jsx) | JavaScript JSX | 110 | 13 | 20 | 143 |
| [client/src/pages/user/Chat.jsx](/client/src/pages/user/Chat.jsx) | JavaScript JSX | 930 | 29 | 93 | 1,052 |
| [client/src/pages/user/GroupInfoMain.jsx](/client/src/pages/user/GroupInfoMain.jsx) | JavaScript JSX | 541 | 14 | 70 | 625 |
| [client/src/pages/user/Home.jsx](/client/src/pages/user/Home.jsx) | JavaScript JSX | 457 | 14 | 61 | 532 |
| [client/src/pages/user/Sidebar.jsx](/client/src/pages/user/Sidebar.jsx) | JavaScript JSX | 205 | 10 | 38 | 253 |
| [client/src/services/getTime.js](/client/src/services/getTime.js) | JavaScript | 7 | 1 | 0 | 8 |
| [client/src/services/isThisLink.js](/client/src/services/isThisLink.js) | JavaScript | 7 | 0 | 0 | 7 |
| [client/src/socket/handlers/chat.handler.js](/client/src/socket/handlers/chat.handler.js) | JavaScript | 13 | 0 | 5 | 18 |
| [client/src/socket/handlers/error.handler.js](/client/src/socket/handlers/error.handler.js) | JavaScript | 6 | 1 | 1 | 8 |
| [client/src/socket/handlers/group.handler.js](/client/src/socket/handlers/group.handler.js) | JavaScript | 19 | 0 | 8 | 27 |
| [client/src/socket/handlers/message.handler.js](/client/src/socket/handlers/message.handler.js) | JavaScript | 55 | 9 | 32 | 96 |
| [client/src/socket/handlers/notification.handler.js](/client/src/socket/handlers/notification.handler.js) | JavaScript | 10 | 0 | 6 | 16 |
| [client/src/socket/handlers/onlineStatus.handler.js](/client/src/socket/handlers/onlineStatus.handler.js) | JavaScript | 20 | 2 | 3 | 25 |
| [client/src/socket/socket.js](/client/src/socket/socket.js) | JavaScript | 5 | 0 | 5 | 10 |
| [client/src/socket/socketListeners.js](/client/src/socket/socketListeners.js) | JavaScript | 25 | 0 | 15 | 40 |
| [client/src/store/useAssetsStore.js](/client/src/store/useAssetsStore.js) | JavaScript | 18 | 0 | 8 | 26 |
| [client/src/store/useChatStore.js](/client/src/store/useChatStore.js) | JavaScript | 345 | 0 | 66 | 411 |
| [client/src/store/useGroupChatStore.js](/client/src/store/useGroupChatStore.js) | JavaScript | 58 | 0 | 13 | 71 |
| [client/src/store/userStore.js](/client/src/store/userStore.js) | JavaScript | 25 | 1 | 10 | 36 |
| [client/tailwind.config.js](/client/tailwind.config.js) | JavaScript | 95 | 1 | 0 | 96 |
| [client/vercel.json](/client/vercel.json) | JSON | 5 | 0 | 0 | 5 |
| [client/vite.config.js](/client/vite.config.js) | JavaScript | 5 | 1 | 2 | 8 |
| [server/package-lock.json](/server/package-lock.json) | JSON | 3,969 | 0 | 1 | 3,970 |
| [server/package.json](/server/package.json) | JSON | 40 | 0 | 1 | 41 |
| [server/src/constants/socketEvents.js](/server/src/constants/socketEvents.js) | JavaScript | 33 | 0 | 0 | 33 |
| [server/src/controllers/chat.controller.js](/server/src/controllers/chat.controller.js) | JavaScript | 332 | 2 | 70 | 404 |
| [server/src/controllers/group.controller.js](/server/src/controllers/group.controller.js) | JavaScript | 285 | 18 | 80 | 383 |
| [server/src/controllers/message.controller.js](/server/src/controllers/message.controller.js) | JavaScript | 165 | 45 | 59 | 269 |
| [server/src/controllers/notification.controller.js](/server/src/controllers/notification.controller.js) | JavaScript | 67 | 11 | 17 | 95 |
| [server/src/controllers/request.controller.js](/server/src/controllers/request.controller.js) | JavaScript | 54 | 28 | 24 | 106 |
| [server/src/controllers/user.controller.js](/server/src/controllers/user.controller.js) | JavaScript | 840 | 32 | 187 | 1,059 |
| [server/src/db/db.js](/server/src/db/db.js) | JavaScript | 14 | 0 | 3 | 17 |
| [server/src/index.js](/server/src/index.js) | JavaScript | 10 | 2 | 3 | 15 |
| [server/src/middlewares/adminPermission.middleware.js](/server/src/middlewares/adminPermission.middleware.js) | JavaScript | 21 | 0 | 6 | 27 |
| [server/src/middlewares/draftImage.middleware.js](/server/src/middlewares/draftImage.middleware.js) | JavaScript | 15 | 0 | 2 | 17 |
| [server/src/middlewares/draftOwner.middleware.js](/server/src/middlewares/draftOwner.middleware.js) | JavaScript | 23 | 0 | 8 | 31 |
| [server/src/middlewares/multer.middleware.js](/server/src/middlewares/multer.middleware.js) | JavaScript | 10 | 0 | 2 | 12 |
| [server/src/middlewares/publicProfile.middleware.js](/server/src/middlewares/publicProfile.middleware.js) | JavaScript | 20 | 0 | 8 | 28 |
| [server/src/middlewares/userAuth.middleware.js](/server/src/middlewares/userAuth.middleware.js) | JavaScript | 35 | 2 | 12 | 49 |
| [server/src/models/chat.model.js](/server/src/models/chat.model.js) | JavaScript | 47 | 0 | 16 | 63 |
| [server/src/models/message.model.js](/server/src/models/message.model.js) | JavaScript | 95 | 1 | 10 | 106 |
| [server/src/models/notification.model.js](/server/src/models/notification.model.js) | JavaScript | 47 | 0 | 5 | 52 |
| [server/src/models/request.model.js](/server/src/models/request.model.js) | JavaScript | 47 | 0 | 4 | 51 |
| [server/src/models/user.model.js](/server/src/models/user.model.js) | JavaScript | 83 | 0 | 10 | 93 |
| [server/src/redis/config.js](/server/src/redis/config.js) | JavaScript | 6 | 2 | 3 | 11 |
| [server/src/routes/chat.route.js](/server/src/routes/chat.route.js) | JavaScript | 20 | 2 | 2 | 24 |
| [server/src/routes/group.route.js](/server/src/routes/group.route.js) | JavaScript | 30 | 0 | 4 | 34 |
| [server/src/routes/message.route.js](/server/src/routes/message.route.js) | JavaScript | 19 | 2 | 3 | 24 |
| [server/src/routes/notification.route.js](/server/src/routes/notification.route.js) | JavaScript | 13 | 0 | 4 | 17 |
| [server/src/routes/ping.route.js](/server/src/routes/ping.route.js) | JavaScript | 18 | 0 | 4 | 22 |
| [server/src/routes/request.route.js](/server/src/routes/request.route.js) | JavaScript | 15 | 0 | 3 | 18 |
| [server/src/routes/user.route.js](/server/src/routes/user.route.js) | JavaScript | 49 | 0 | 4 | 53 |
| [server/src/server.js](/server/src/server.js) | JavaScript | 38 | 5 | 15 | 58 |
| [server/src/services/ai.service.js](/server/src/services/ai.service.js) | JavaScript | 40 | 0 | 10 | 50 |
| [server/src/services/brevoMail.service.js](/server/src/services/brevoMail.service.js) | JavaScript | 21 | 6 | 8 | 35 |
| [server/src/services/chat.services.js](/server/src/services/chat.services.js) | JavaScript | 40 | 14 | 12 | 66 |
| [server/src/services/cloudinary.service.js](/server/src/services/cloudinary.service.js) | JavaScript | 44 | 8 | 15 | 67 |
| [server/src/services/generateOTP.js](/server/src/services/generateOTP.js) | JavaScript | 3 | 2 | 1 | 6 |
| [server/src/services/generateTokens.js](/server/src/services/generateTokens.js) | JavaScript | 6 | 0 | 2 | 8 |
| [server/src/services/group.service.js](/server/src/services/group.service.js) | JavaScript | 105 | 34 | 48 | 187 |
| [server/src/services/mail.service.js](/server/src/services/mail.service.js) | JavaScript | 35 | 0 | 7 | 42 |
| [server/src/services/mailSender.service.js](/server/src/services/mailSender.service.js) | JavaScript | 21 | 0 | 7 | 28 |
| [server/src/services/message.service.js](/server/src/services/message.service.js) | JavaScript | 119 | 33 | 36 | 188 |
| [server/src/services/notification.service.js](/server/src/services/notification.service.js) | JavaScript | 122 | 27 | 25 | 174 |
| [server/src/services/request.service.js](/server/src/services/request.service.js) | JavaScript | 130 | 26 | 42 | 198 |
| [server/src/services/sendOTP.js](/server/src/services/sendOTP.js) | JavaScript | 20 | 0 | 4 | 24 |
| [server/src/services/sendVerificationToken.js](/server/src/services/sendVerificationToken.js) | JavaScript | 128 | 0 | 14 | 142 |
| [server/src/sockets/handler/chat.handler.js](/server/src/sockets/handler/chat.handler.js) | JavaScript | 7 | 1 | 4 | 12 |
| [server/src/sockets/handler/disconnect.handler.js](/server/src/sockets/handler/disconnect.handler.js) | JavaScript | 32 | 0 | 9 | 41 |
| [server/src/sockets/handler/group.handler.js](/server/src/sockets/handler/group.handler.js) | JavaScript | 13 | 40 | 16 | 69 |
| [server/src/sockets/handler/index.js](/server/src/sockets/handler/index.js) | JavaScript | 15 | 0 | 4 | 19 |
| [server/src/sockets/handler/message.handler.js](/server/src/sockets/handler/message.handler.js) | JavaScript | 287 | 2 | 83 | 372 |
| [server/src/sockets/handler/onlineStatus.handler.js](/server/src/sockets/handler/onlineStatus.handler.js) | JavaScript | 36 | 2 | 13 | 51 |
| [server/src/sockets/handler/onlineStatusAfterLogin.js](/server/src/sockets/handler/onlineStatusAfterLogin.js) | JavaScript | 51 | 2 | 12 | 65 |
| [server/src/sockets/index.js](/server/src/sockets/index.js) | JavaScript | 28 | 3 | 17 | 48 |
| [server/src/sockets/middleware/adminPermission.middleware.js](/server/src/sockets/middleware/adminPermission.middleware.js) | JavaScript | 23 | 0 | 7 | 30 |
| [server/src/sockets/middleware/auth.middleware.js](/server/src/sockets/middleware/auth.middleware.js) | JavaScript | 27 | 2 | 11 | 40 |
| [server/src/sockets/services/group.service.js](/server/src/sockets/services/group.service.js) | JavaScript | 22 | 7 | 5 | 34 |
| [server/src/sockets/services/message.service.js](/server/src/sockets/services/message.service.js) | JavaScript | 14 | 0 | 6 | 20 |
| [server/src/sockets/socketInstance.js](/server/src/sockets/socketInstance.js) | JavaScript | 10 | 0 | 2 | 12 |
| [server/src/sockets/soketsMap.js](/server/src/sockets/soketsMap.js) | JavaScript | 10 | 0 | 3 | 13 |
| [server/src/sockets/utils/cookieParser.js](/server/src/sockets/utils/cookieParser.js) | JavaScript | 11 | 0 | 1 | 12 |
| [server/src/sockets/utils/getGroupMembers.js](/server/src/sockets/utils/getGroupMembers.js) | JavaScript | 19 | 6 | 9 | 34 |
| [server/src/sockets/utils/getOtherChatUser.js](/server/src/sockets/utils/getOtherChatUser.js) | JavaScript | 13 | 0 | 6 | 19 |
| [server/src/sockets/utils/getUserChatPartners.js](/server/src/sockets/utils/getUserChatPartners.js) | JavaScript | 18 | 0 | 7 | 25 |
| [server/src/sockets/utils/getUserGroups.js](/server/src/sockets/utils/getUserGroups.js) | JavaScript | 38 | 6 | 15 | 59 |
| [server/src/sockets/utils/isGroupChat.js](/server/src/sockets/utils/isGroupChat.js) | JavaScript | 12 | 0 | 5 | 17 |
| [server/src/utils/apiUtils.js](/server/src/utils/apiUtils.js) | JavaScript | 25 | 0 | 5 | 30 |
| [server/src/utils/asyncHandler.js](/server/src/utils/asyncHandler.js) | JavaScript | 10 | 0 | 2 | 12 |
| [server/src/utils/document existance check/chat.js](/server/src/utils/document%20existance%20check/chat.js) | JavaScript | 13 | 0 | 5 | 18 |
| [server/src/utils/document existance check/group.js](/server/src/utils/document%20existance%20check/group.js) | JavaScript | 3 | 5 | 2 | 10 |
| [server/src/utils/document existance check/message.js](/server/src/utils/document%20existance%20check/message.js) | JavaScript | 13 | 0 | 5 | 18 |
| [server/src/utils/document existance check/request.js](/server/src/utils/document%20existance%20check/request.js) | JavaScript | 12 | 0 | 6 | 18 |
| [server/src/utils/document existance check/user.js](/server/src/utils/document%20existance%20check/user.js) | JavaScript | 12 | 0 | 6 | 18 |
| [server/src/utils/fields validations/assertAtleastOneField.js](/server/src/utils/fields%20validations/assertAtleastOneField.js) | JavaScript | 10 | 0 | 2 | 12 |
| [server/src/utils/fields validations/assertRequiredFields.js](/server/src/utils/fields%20validations/assertRequiredFields.js) | JavaScript | 13 | 0 | 9 | 22 |
| [server/src/utils/fields validations/validateAtleastOneField.js](/server/src/utils/fields%20validations/validateAtleastOneField.js) | JavaScript | 10 | 0 | 2 | 12 |
| [server/src/utils/fields validations/validateRequiredFields.js](/server/src/utils/fields%20validations/validateRequiredFields.js) | JavaScript | 15 | 4 | 8 | 27 |
| [server/src/utils/getUniqueMembers.js](/server/src/utils/getUniqueMembers.js) | JavaScript | 13 | 11 | 8 | 32 |
| [server/src/utils/isValidObjectId.js](/server/src/utils/isValidObjectId.js) | JavaScript | 7 | 0 | 4 | 11 |
| [server/src/utils/verify-success.html](/server/src/utils/verify-success.html) | HTML | 77 | 0 | 9 | 86 |
| [system\_design.md](/system_design.md) | Markdown | 332 | 0 | 70 | 402 |
| [test.js](/test.js) | JavaScript | 8 | 0 | 3 | 11 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)