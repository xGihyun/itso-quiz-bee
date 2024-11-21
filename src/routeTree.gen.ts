/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AboutImport } from './routes/about'
import { Route as IndexImport } from './routes/index'
import { Route as UsersIndexImport } from './routes/users/index'
import { Route as TimerIndexImport } from './routes/timer/index'
import { Route as RegisterIndexImport } from './routes/register/index'
import { Route as QuizzesIndexImport } from './routes/quizzes/index'
import { Route as LoginIndexImport } from './routes/login/index'
import { Route as LobbiesIndexImport } from './routes/lobbies/index'
import { Route as QuizzesQuizIdIndexImport } from './routes/quizzes/$quizId/index'
import { Route as LobbiesLobbyIdIndexImport } from './routes/lobbies/$lobbyId/index'
import { Route as QuizzesQuizIdViewIndexImport } from './routes/quizzes/$quizId/view/index'
import { Route as QuizzesQuizIdEditIndexImport } from './routes/quizzes/$quizId/edit/index'
import { Route as QuizzesQuizIdAnswerIndexImport } from './routes/quizzes/$quizId/answer/index'

// Create/Update Routes

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const UsersIndexRoute = UsersIndexImport.update({
  id: '/users/',
  path: '/users/',
  getParentRoute: () => rootRoute,
} as any)

const TimerIndexRoute = TimerIndexImport.update({
  id: '/timer/',
  path: '/timer/',
  getParentRoute: () => rootRoute,
} as any)

const RegisterIndexRoute = RegisterIndexImport.update({
  id: '/register/',
  path: '/register/',
  getParentRoute: () => rootRoute,
} as any)

const QuizzesIndexRoute = QuizzesIndexImport.update({
  id: '/quizzes/',
  path: '/quizzes/',
  getParentRoute: () => rootRoute,
} as any)

const LoginIndexRoute = LoginIndexImport.update({
  id: '/login/',
  path: '/login/',
  getParentRoute: () => rootRoute,
} as any)

const LobbiesIndexRoute = LobbiesIndexImport.update({
  id: '/lobbies/',
  path: '/lobbies/',
  getParentRoute: () => rootRoute,
} as any)

const QuizzesQuizIdIndexRoute = QuizzesQuizIdIndexImport.update({
  id: '/quizzes/$quizId/',
  path: '/quizzes/$quizId/',
  getParentRoute: () => rootRoute,
} as any)

const LobbiesLobbyIdIndexRoute = LobbiesLobbyIdIndexImport.update({
  id: '/lobbies/$lobbyId/',
  path: '/lobbies/$lobbyId/',
  getParentRoute: () => rootRoute,
} as any)

const QuizzesQuizIdViewIndexRoute = QuizzesQuizIdViewIndexImport.update({
  id: '/quizzes/$quizId/view/',
  path: '/quizzes/$quizId/view/',
  getParentRoute: () => rootRoute,
} as any)

const QuizzesQuizIdEditIndexRoute = QuizzesQuizIdEditIndexImport.update({
  id: '/quizzes/$quizId/edit/',
  path: '/quizzes/$quizId/edit/',
  getParentRoute: () => rootRoute,
} as any)

const QuizzesQuizIdAnswerIndexRoute = QuizzesQuizIdAnswerIndexImport.update({
  id: '/quizzes/$quizId/answer/',
  path: '/quizzes/$quizId/answer/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/lobbies/': {
      id: '/lobbies/'
      path: '/lobbies'
      fullPath: '/lobbies'
      preLoaderRoute: typeof LobbiesIndexImport
      parentRoute: typeof rootRoute
    }
    '/login/': {
      id: '/login/'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginIndexImport
      parentRoute: typeof rootRoute
    }
    '/quizzes/': {
      id: '/quizzes/'
      path: '/quizzes'
      fullPath: '/quizzes'
      preLoaderRoute: typeof QuizzesIndexImport
      parentRoute: typeof rootRoute
    }
    '/register/': {
      id: '/register/'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof RegisterIndexImport
      parentRoute: typeof rootRoute
    }
    '/timer/': {
      id: '/timer/'
      path: '/timer'
      fullPath: '/timer'
      preLoaderRoute: typeof TimerIndexImport
      parentRoute: typeof rootRoute
    }
    '/users/': {
      id: '/users/'
      path: '/users'
      fullPath: '/users'
      preLoaderRoute: typeof UsersIndexImport
      parentRoute: typeof rootRoute
    }
    '/lobbies/$lobbyId/': {
      id: '/lobbies/$lobbyId/'
      path: '/lobbies/$lobbyId'
      fullPath: '/lobbies/$lobbyId'
      preLoaderRoute: typeof LobbiesLobbyIdIndexImport
      parentRoute: typeof rootRoute
    }
    '/quizzes/$quizId/': {
      id: '/quizzes/$quizId/'
      path: '/quizzes/$quizId'
      fullPath: '/quizzes/$quizId'
      preLoaderRoute: typeof QuizzesQuizIdIndexImport
      parentRoute: typeof rootRoute
    }
    '/quizzes/$quizId/answer/': {
      id: '/quizzes/$quizId/answer/'
      path: '/quizzes/$quizId/answer'
      fullPath: '/quizzes/$quizId/answer'
      preLoaderRoute: typeof QuizzesQuizIdAnswerIndexImport
      parentRoute: typeof rootRoute
    }
    '/quizzes/$quizId/edit/': {
      id: '/quizzes/$quizId/edit/'
      path: '/quizzes/$quizId/edit'
      fullPath: '/quizzes/$quizId/edit'
      preLoaderRoute: typeof QuizzesQuizIdEditIndexImport
      parentRoute: typeof rootRoute
    }
    '/quizzes/$quizId/view/': {
      id: '/quizzes/$quizId/view/'
      path: '/quizzes/$quizId/view'
      fullPath: '/quizzes/$quizId/view'
      preLoaderRoute: typeof QuizzesQuizIdViewIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/lobbies': typeof LobbiesIndexRoute
  '/login': typeof LoginIndexRoute
  '/quizzes': typeof QuizzesIndexRoute
  '/register': typeof RegisterIndexRoute
  '/timer': typeof TimerIndexRoute
  '/users': typeof UsersIndexRoute
  '/lobbies/$lobbyId': typeof LobbiesLobbyIdIndexRoute
  '/quizzes/$quizId': typeof QuizzesQuizIdIndexRoute
  '/quizzes/$quizId/answer': typeof QuizzesQuizIdAnswerIndexRoute
  '/quizzes/$quizId/edit': typeof QuizzesQuizIdEditIndexRoute
  '/quizzes/$quizId/view': typeof QuizzesQuizIdViewIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/lobbies': typeof LobbiesIndexRoute
  '/login': typeof LoginIndexRoute
  '/quizzes': typeof QuizzesIndexRoute
  '/register': typeof RegisterIndexRoute
  '/timer': typeof TimerIndexRoute
  '/users': typeof UsersIndexRoute
  '/lobbies/$lobbyId': typeof LobbiesLobbyIdIndexRoute
  '/quizzes/$quizId': typeof QuizzesQuizIdIndexRoute
  '/quizzes/$quizId/answer': typeof QuizzesQuizIdAnswerIndexRoute
  '/quizzes/$quizId/edit': typeof QuizzesQuizIdEditIndexRoute
  '/quizzes/$quizId/view': typeof QuizzesQuizIdViewIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/lobbies/': typeof LobbiesIndexRoute
  '/login/': typeof LoginIndexRoute
  '/quizzes/': typeof QuizzesIndexRoute
  '/register/': typeof RegisterIndexRoute
  '/timer/': typeof TimerIndexRoute
  '/users/': typeof UsersIndexRoute
  '/lobbies/$lobbyId/': typeof LobbiesLobbyIdIndexRoute
  '/quizzes/$quizId/': typeof QuizzesQuizIdIndexRoute
  '/quizzes/$quizId/answer/': typeof QuizzesQuizIdAnswerIndexRoute
  '/quizzes/$quizId/edit/': typeof QuizzesQuizIdEditIndexRoute
  '/quizzes/$quizId/view/': typeof QuizzesQuizIdViewIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/about'
    | '/lobbies'
    | '/login'
    | '/quizzes'
    | '/register'
    | '/timer'
    | '/users'
    | '/lobbies/$lobbyId'
    | '/quizzes/$quizId'
    | '/quizzes/$quizId/answer'
    | '/quizzes/$quizId/edit'
    | '/quizzes/$quizId/view'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/about'
    | '/lobbies'
    | '/login'
    | '/quizzes'
    | '/register'
    | '/timer'
    | '/users'
    | '/lobbies/$lobbyId'
    | '/quizzes/$quizId'
    | '/quizzes/$quizId/answer'
    | '/quizzes/$quizId/edit'
    | '/quizzes/$quizId/view'
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/lobbies/'
    | '/login/'
    | '/quizzes/'
    | '/register/'
    | '/timer/'
    | '/users/'
    | '/lobbies/$lobbyId/'
    | '/quizzes/$quizId/'
    | '/quizzes/$quizId/answer/'
    | '/quizzes/$quizId/edit/'
    | '/quizzes/$quizId/view/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  LobbiesIndexRoute: typeof LobbiesIndexRoute
  LoginIndexRoute: typeof LoginIndexRoute
  QuizzesIndexRoute: typeof QuizzesIndexRoute
  RegisterIndexRoute: typeof RegisterIndexRoute
  TimerIndexRoute: typeof TimerIndexRoute
  UsersIndexRoute: typeof UsersIndexRoute
  LobbiesLobbyIdIndexRoute: typeof LobbiesLobbyIdIndexRoute
  QuizzesQuizIdIndexRoute: typeof QuizzesQuizIdIndexRoute
  QuizzesQuizIdAnswerIndexRoute: typeof QuizzesQuizIdAnswerIndexRoute
  QuizzesQuizIdEditIndexRoute: typeof QuizzesQuizIdEditIndexRoute
  QuizzesQuizIdViewIndexRoute: typeof QuizzesQuizIdViewIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  LobbiesIndexRoute: LobbiesIndexRoute,
  LoginIndexRoute: LoginIndexRoute,
  QuizzesIndexRoute: QuizzesIndexRoute,
  RegisterIndexRoute: RegisterIndexRoute,
  TimerIndexRoute: TimerIndexRoute,
  UsersIndexRoute: UsersIndexRoute,
  LobbiesLobbyIdIndexRoute: LobbiesLobbyIdIndexRoute,
  QuizzesQuizIdIndexRoute: QuizzesQuizIdIndexRoute,
  QuizzesQuizIdAnswerIndexRoute: QuizzesQuizIdAnswerIndexRoute,
  QuizzesQuizIdEditIndexRoute: QuizzesQuizIdEditIndexRoute,
  QuizzesQuizIdViewIndexRoute: QuizzesQuizIdViewIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/lobbies/",
        "/login/",
        "/quizzes/",
        "/register/",
        "/timer/",
        "/users/",
        "/lobbies/$lobbyId/",
        "/quizzes/$quizId/",
        "/quizzes/$quizId/answer/",
        "/quizzes/$quizId/edit/",
        "/quizzes/$quizId/view/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/lobbies/": {
      "filePath": "lobbies/index.tsx"
    },
    "/login/": {
      "filePath": "login/index.tsx"
    },
    "/quizzes/": {
      "filePath": "quizzes/index.tsx"
    },
    "/register/": {
      "filePath": "register/index.tsx"
    },
    "/timer/": {
      "filePath": "timer/index.tsx"
    },
    "/users/": {
      "filePath": "users/index.tsx"
    },
    "/lobbies/$lobbyId/": {
      "filePath": "lobbies/$lobbyId/index.tsx"
    },
    "/quizzes/$quizId/": {
      "filePath": "quizzes/$quizId/index.tsx"
    },
    "/quizzes/$quizId/answer/": {
      "filePath": "quizzes/$quizId/answer/index.tsx"
    },
    "/quizzes/$quizId/edit/": {
      "filePath": "quizzes/$quizId/edit/index.tsx"
    },
    "/quizzes/$quizId/view/": {
      "filePath": "quizzes/$quizId/view/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
