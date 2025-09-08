import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // omitted for brevity
  kit: {
    adapter: adapter({
      fallback: 'index.html' // this filename can be whatever you want
    }),
    prerender: { entries: [] },
  },
};

export default config;