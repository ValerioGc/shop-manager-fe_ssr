<h1 align="center" id="title">Shop Manager Frontend SSR</h1>


<div align="center">
  <img alt="Static Badge" src="https://img.shields.io/badge/Release-V--1.0.0-black?logoColor=%23000000&logoSize=16px&label=Release&labelColor=%230a66c2&color=%23c6cdcc"> 
  <img src="https://img.shields.io/badge/NodeJs-V--20.0.1-black?logo=npm&logoColor=%23000000&logoSize=16px&label=NodeJS&labelColor=%2397ca00&color=%23c6cdcc" alt="shields" />
</div>

<br/>

***Shop Manager Frontend SSR** is a production-ready showcase site built with **Vue.js** and **Nuxt.js** (SSR) in **TypeScript**, using **Pinia** for state management and **Sass** for styling. 
The frontend reads a local **config.json** at build time to manage API endpoints, feature flags, theming, and SEO defaults these settings are also stored and editable via the [Back Office Admin panel](https://github.com/ValerioGc/shop-manager-bo). At runtime, the app fetches dynamic data (products, categories, contacts, etc..) from the [Shop Manager Backend](https://github.com/ValerioGc/laravel-shop-manager) via RESTful APIs with built-in error handling. Fully server-side rendered with Nuxt.js and Pinia, every page ships complete HTML and dynamic meta tags for instant load and SEO.*
  

<br/> 

<h2 id="desc">💻 Built with</h2>

<table align="center" style="border-collapse: collapse; border: none;">
  <tr>
    <td style="padding: 10px; border: none;">
      <img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" alt="logo typescript" width="50px" height="50px" />
    </td>
    <td style="padding: 10px; border: none;">
      <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg" alt="logo vue" width="50px" height="50px" />
    </td>
    <td style="padding: 10px; border: none;">
      <img src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Nuxt_logo.svg" alt="logo nuxt" width="50px" height="50px" />
    </td>
    <td style="padding: 10px; border: none;">
      <img src="https://upload.wikimedia.org/wikipedia/commons/1/1c/Pinialogo.svg" alt="logo pinia" width="50px" height="50px" />
    </td>
    <td style="padding: 10px; border: none;">
      <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Sass_Logo_Color.svg" alt="logo sass" width="50px" height="50px" />
    </td>
  </tr>
</table>
</div>

<br/> 
<br/> 

# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.


<h2 id="installation">🛠️ Installation Step:</h2>

##### 1. Install dependencies

```sh
npm install
```

##### 2. Update dependencies

```sh
npm update
```

##### 3. Compile and start the development server on `http://localhost:3000`:
```sh
npm run dev
```

<br/> 
<br/> 


<h2 id="build">🔨 Build and Optimization for Deploy</h2>

##### 1. Generate sitemap dynamically (sitemap.xml) using the router for PROD and TEST environments 

```sh
npm run generate-sitemap:prod // PRODUCTION
npm run generate-sitemap:test // TEST 
``` 

##### 2. Compile and Minify for Production

```sh
npm run build
``` 

##### 3. Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
