import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: { unoptimized: true },
  async redirects() {
    return [
    {
        "source": "/modern/linear-system-theory",
        "destination": "/modern/lyapunov-modern",
        "permanent": true
    },
    {
        "source": "/modern/kalman-filter",
        "destination": "/estimation/kalman-filter",
        "permanent": true
    },
    {
        "source": "/estimation/h-infinity-filter",
        "destination": "/robust/h-infinity-filter",
        "permanent": true
    },
    {
        "source": "/estimation/mhe-fusion",
        "destination": "/mpc/mhe-fusion",
        "permanent": true
    },
    {
        "source": "/mpc/distributed-mpc",
        "destination": "/multi-agent/distributed-mpc",
        "permanent": true
    },
    {
        "source": "/rl-control/safe-rl",
        "destination": "/safety-ftc/safe-rl",
        "permanent": true
    },
    {
        "source": "/rl-control/multi-agent-rl",
        "destination": "/multi-agent/multi-agent-rl",
        "permanent": true
    },
    {
        "source": "/applications/auto-driving-control",
        "destination": "/autonomous-driving/vehicle-control",
        "permanent": true
    },
    {
        "source": "/applications/robotics-control",
        "destination": "/robotics/robotics-case-study",
        "permanent": true
    }
]
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
