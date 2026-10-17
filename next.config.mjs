import createMDX from '@next/mdx'
import { lessonRedirects } from './lib/lesson-compat.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: { unoptimized: true },
  async redirects() {
    return lessonRedirects.map(([source, destination]) => ({ source: '/' + source, destination: '/' + destination, permanent: true }))
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
