import createMDX from '@next/mdx'
import { lessonRedirects } from './lib/lesson-compat.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.PAGES_BUILD === '1' ? {
    output: 'export',
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/control-universe',
    trailingSlash: true,
  } : {}),
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: { unoptimized: true },
  ...(process.env.PAGES_BUILD === '1' ? {} : { async redirects() {
    return lessonRedirects.map(([source, destination]) => ({ source: '/' + source, destination: '/' + destination, permanent: true }))
  } }),
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
