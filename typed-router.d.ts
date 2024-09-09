/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'vue-router'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/[...path]': RouteRecordInfo<'/[...path]', '/:path(.*)', { path: ParamValue<true> }, { path: ParamValue<false> }>,
    '/ask/': RouteRecordInfo<'/ask/', '/ask', Record<never, never>, Record<never, never>>,
    '/ask/[id]': RouteRecordInfo<'/ask/[id]', '/ask/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/ask/write/': RouteRecordInfo<'/ask/write/', '/ask/write', Record<never, never>, Record<never, never>>,
    '/ask/write/[id]': RouteRecordInfo<'/ask/write/[id]', '/ask/write/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/free/': RouteRecordInfo<'/free/', '/free', Record<never, never>, Record<never, never>>,
    '/free/[id]': RouteRecordInfo<'/free/[id]', '/free/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/free/write/': RouteRecordInfo<'/free/write/', '/free/write', Record<never, never>, Record<never, never>>,
    '/free/write/[id]': RouteRecordInfo<'/free/write/[id]', '/free/write/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/gallery/': RouteRecordInfo<'/gallery/', '/gallery', Record<never, never>, Record<never, never>>,
    '/gallery/[id]': RouteRecordInfo<'/gallery/[id]', '/gallery/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/gallery/write/': RouteRecordInfo<'/gallery/write/', '/gallery/write', Record<never, never>, Record<never, never>>,
    '/gallery/write/[id]': RouteRecordInfo<'/gallery/write/[id]', '/gallery/write/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/login': RouteRecordInfo<'/login', '/login', Record<never, never>, Record<never, never>>,
    '/notice/': RouteRecordInfo<'/notice/', '/notice', Record<never, never>, Record<never, never>>,
    '/notice/[id]': RouteRecordInfo<'/notice/[id]', '/notice/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/signup': RouteRecordInfo<'/signup', '/signup', Record<never, never>, Record<never, never>>,
  }
}
