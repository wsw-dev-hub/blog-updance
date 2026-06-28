import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import { resolve } from 'path'
import mkcert from 'vite-plugin-mkcert'
import { Buffer } from 'buffer'
import { fileURLToPath } from 'url'

globalThis.Buffer = Buffer
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Plugin: serve o manifest com campo "url" dinâmico baseado no Host da requisição
// Resolve o anti-phishing do Tonkeeper em qualquer ambiente (local, tunnel, prod)
// ─── Plugin: serve o manifest TON Connect dinamicamente ───────────────────────
// Preenche o campo "url" com o host real da requisição.
// Funciona em localhost, IP de rede, Cloudflare Tunnel e produção
// sem necessidade de alterar nenhum outro arquivo.
const _tonManifestPlugin = {
  name: 'ton-connect-manifest',
  configureServer(server) {
    server.middlewares.use('/tonconnect-manifest.json', (req, res) => {
      try {
        const filePath = path.resolve(
          process.cwd(), 'public', 'tonconnect-manifest.json'
        )
        const base = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

        const proto = req.socket?.encrypted ? 'https' : 'http'
        const host  = req.headers['x-forwarded-host'] || req.headers.host
        base.url    = `${proto}://${host}`

        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Cache-Control', 'no-store')
        res.statusCode = 200
        res.end(JSON.stringify(base))
      } catch (e) {
        console.error('[TON manifest]', e.message)
        res.statusCode = 500
        res.end(JSON.stringify({ error: e.message }))
      }
    })
  }
}


//export default defineConfig({
export default defineConfig(({ command }) => ({
  base: '/',
  //root: '.',
  // Dev usa '/' para servir arquivos estáticos corretamente
  // Build usa './' para compatibilidade com Cloudflare Pages
  //base: command === 'build' ? './' : '/',
  publicDir: 'public',
  //plugins: [mkcert(), _tonManifestPlugin],
  plugins: [
    command === 'serve' && mkcert(),   // apenas no dev server
    command === 'serve' && _tonManifestPlugin, // manifest dinâmico só em dev
  ].filter(Boolean),

  server: {
    port: 3000,
    open: true,
    host: !!process.env.EXPOSE_HOST,  // só expõe se a variável existir
    //host: true,       // ← permite acessar de outros dispositivos na rede
    https: true
    /*https: {
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost-cert.pem')),
      key:  fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
    }*/
  },

  define: {
    global: 'globalThis',
  },

  resolve: {
    alias: {
      buffer: 'buffer',
      '@': '/src',
      '@lib': '/src/lib',
    },
  },

  optimizeDeps: {
    include: ['buffer'],
    exclude: ['@mediapipe/holistic'],
  },

  build: {
    outDir: 'dist',
    sourcemap: false,         // NUNCA gerar sourcemaps em produção
    minify: 'esbuild',
    rollupOptions: {
      input:{
        main: resolve(__dirname, 'index.html'),
        'posts/9-licoes': resolve(__dirname, 'src/posts/9-licoes.html'),
        'articles/artigos': resolve(__dirname, 'src/articles/artigos.html'),
        'tracks/trilhas': resolve(__dirname, 'src/tracks/trilhas.html'),
        'tracks/trilha-tecnica':resolve(__dirname, 'src/tracks/trilha-tecnica.html'),
        'clube/clube': resolve(__dirname, '/src/clube/clube.html'),
        //'posts/post-2': resolve(__dirname, 'src/posts/post-2.html'),
      },
      external: ['ton-connect', 'ton-core'],
      output: {
        
        /*manualChunks: {
          'ton-connect': ['@tonconnect/ui', '@tonconnect/sdk'],
          'ton-core': ['@ton/ton', '@ton/core', '@ton/crypto'],
        },*/
      }
      /*manualChunks: {
        'ton-connect': ['@tonconnect/ui', '@tonconnect/sdk'],
        'ton-core': ['@ton/ton', '@ton/core', '@ton/crypto'],
      },*/
    }
  },
  worker: {
    format: 'es',
  },
}))
