/* assets.js はLoaderに読み込ませるリソースの情報をまとめた 連想配列 を作成し、
export するファイルです。export default 構文ではあらゆる式が許可されます。
連想配列にまとめる情報はリソースの name,type,path です。
name,type は自分で決めてよいですが、pathは Loader が models データを取得する時に必要です。
また、/から始まるパスはパブリックパスと言い、 public ディレクトリを指します。
Vite.js の関数により、 puclic ディレクトリに配置されたアセットは開発環境ではルートパス(/)で提供され、
そのままdistディレクトリのルートにコピーされます。
それはViteのdep-ca21228b.jsにある複数のメソッドから分かります。

function checkPublicFile(url, { publicDir }) {
    // note if the file is in /public, the resolver would have returned it
    // as-is so it's not going to be a fully resolved path.
    if (!publicDir || !url.startsWith('/')) {
        return;
    }
    const publicFile = path$o.join(publicDir, cleanUrl(url));
    if (!publicFile.startsWith(publicDir)) {
        // can happen if URL starts with '../'
        return;
    }
    if (fs$l.existsSync(publicFile)) {
        return publicFile;
    }
    else {
        return;
    }
}
async function fileToUrl(id, config, ctx) {
    if (config.command === 'serve') {
        return fileToDevUrl(id, config);
    }
    else {
        return fileToBuiltUrl(id, config, ctx);
    }
}
function fileToDevUrl(id, config) {
    let rtn;
    if (checkPublicFile(id, config)) {
        // in public dir, keep the url as-is
        rtn = id;
    }
    else if (id.startsWith(config.root)) {
        // in project root, infer short public path
        rtn = '/' + path$o.posix.relative(config.root, id);
    }
    else {
        // outside of project root, use absolute fs path
        // (this is special handled by the serve static middleware
        rtn = path$o.posix.join(FS_PREFIX, id);
    }
    const base = joinUrlSegments(config.server?.origin ?? '', config.base);
    return joinUrlSegments(base, rtn.replace(/^\//, ''));
}
function getPublicAssetFilename(hash, config) {
    return publicAssetUrlCache.get(config)?.get(hash);
}
const publicAssetUrlCache = new WeakMap();
const publicAssetUrlRE = /__VITE_PUBLIC_ASSET__([a-z\d]{8})__/g;
function publicFileToBuiltUrl(url, config) {
    if (config.command !== 'build') {
        // We don't need relative base or renderBuiltUrl support during dev
        return joinUrlSegments(config.base, url);
    }
    const hash = getHash(url);
    let cache = publicAssetUrlCache.get(config);
    if (!cache) {
        cache = new Map();
        publicAssetUrlCache.set(config, cache);
    }
    if (!cache.get(hash)) {
        cache.set(hash, url);
    }
    return `__VITE_PUBLIC_ASSET__${hash}__`;
}
const GIT_LFS_PREFIX = Buffer$1.from('version https://git-lfs.github.com');
function isGitLfsPlaceholder(content) {
    if (content.length < GIT_LFS_PREFIX.length)
        return false;
    // Check whether the content begins with the characteristic string of Git LFS placeholders
    return GIT_LFS_PREFIX.compare(content, 0, GIT_LFS_PREFIX.length) === 0;
}
/*
Register an asset to be emitted as part of the bundle (if necessary)and returns the resolved public URL
/
async function fileToBuiltUrl(id, config, pluginContext, skipPublicCheck = false) {
    if (!skipPublicCheck && checkPublicFile(id, config)) {
        return publicFileToBuiltUrl(id, config);
    }
    const cache = assetCache.get(config);
    const cached = cache.get(id);
    if (cached) {
        return cached;
    }
    const file = cleanUrl(id);
    const content = await promises$2.readFile(file);
    let url;
    if (config.build.lib ||
        (!file.endsWith('.svg') &&
            !file.endsWith('.html') &&
            content.length < Number(config.build.assetsInlineLimit) &&
            !isGitLfsPlaceholder(content))) {
        if (config.build.lib && isGitLfsPlaceholder(content)) {
            config.logger.warn(picocolorsExports.yellow(`Inlined file ${id} was not downloaded via Git LFS`));
        }
        const mimeType = lookup(file) ?? 'application/octet-stream';
        // base64 inlined as a string
        url = `data:${mimeType};base64,${content.toString('base64')}`;
    }
    else {
        // emit as asset
        const { search, hash } = parse$i(id);
        const postfix = (search || '') + (hash || '');
        const referenceId = pluginContext.emitFile({
            // Ignore directory structure for asset file names
            name: path$o.basename(file),
            type: 'asset',
            source: content,
        });
        const originalName = normalizePath$3(path$o.relative(config.root, file));
        generatedAssets.get(config).set(referenceId, { originalName });
        url = `__VITE_ASSET__${referenceId}__${postfix ? `$_${postfix}__` : ``}`; // TODO_BASE
    }
    cache.set(id, url);
    return url;
}
async function urlToBuiltUrl(url, importer, config, pluginContext) {
    if (checkPublicFile(url, config)) {
        return publicFileToBuiltUrl(url, config);
    }
    const file = url.startsWith('/')
        ? path$o.join(config.root, url)
        : path$o.join(path$o.dirname(importer), url);
    return fileToBuiltUrl(file, config, pluginContext, 
    // skip public check since we just did it above
    true);
}

function manifestPlugin(config) {
    const manifest = {};
    let outputCount;
    return {
        name: 'vite:manifest',
        buildStart() {
            outputCount = 0;
        },
        generateBundle({ format }, bundle) {
            function getChunkName(chunk) {
                if (chunk.facadeModuleId) {
                    let name = normalizePath$3(path$o.relative(config.root, chunk.facadeModuleId));
                    if (format === 'system' && !chunk.name.includes('-legacy')) {
                        const ext = path$o.extname(name);
                        const endPos = ext.length !== 0 ? -ext.length : undefined;
                        name = name.slice(0, endPos) + `-legacy` + ext;
                    }
                    return name.replace(/\0/g, '');
                }
                else {
                    return `_` + path$o.basename(chunk.fileName);
                }
            }
            function getInternalImports(imports) {
                const filteredImports = [];
                for (const file of imports) {
                    if (bundle[file] === undefined) {
                        continue;
                    }
                    filteredImports.push(getChunkName(bundle[file]));
                }
                return filteredImports;
            }
            function createChunk(chunk) {
                const manifestChunk = {
                    file: chunk.fileName,
                };
                if (chunk.facadeModuleId) {
                    manifestChunk.src = getChunkName(chunk);
                }
                if (chunk.isEntry) {
                    manifestChunk.isEntry = true;
                }
                if (chunk.isDynamicEntry) {
                    manifestChunk.isDynamicEntry = true;
                }
                if (chunk.imports.length) {
                    const internalImports = getInternalImports(chunk.imports);
                    if (internalImports.length > 0) {
                        manifestChunk.imports = internalImports;
                    }
                }
                if (chunk.dynamicImports.length) {
                    const internalImports = getInternalImports(chunk.dynamicImports);
                    if (internalImports.length > 0) {
                        manifestChunk.dynamicImports = internalImports;
                    }
                }
                if (chunk.viteMetadata?.importedCss.size) {
                    manifestChunk.css = [...chunk.viteMetadata.importedCss];
                }
                if (chunk.viteMetadata?.importedAssets.size) {
                    manifestChunk.assets = [...chunk.viteMetadata.importedAssets];
                }
                return manifestChunk;
            }
            function createAsset(asset, src, isEntry) {
                const manifestChunk = {
                    file: asset.fileName,
                    src,
                };
                if (isEntry)
                    manifestChunk.isEntry = true;
                return manifestChunk;
            }
            const fileNameToAssetMeta = new Map();
            const assets = generatedAssets.get(config);
            assets.forEach((asset, referenceId) => {
                const fileName = this.getFileName(referenceId);
                fileNameToAssetMeta.set(fileName, asset);
            });
            const fileNameToAsset = new Map();
            for (const file in bundle) {
                const chunk = bundle[file];
                if (chunk.type === 'chunk') {
                    manifest[getChunkName(chunk)] = createChunk(chunk);
                }
                else if (chunk.type === 'asset' && typeof chunk.name === 'string') {
                    // Add every unique asset to the manifest, keyed by its original name
                    const assetMeta = fileNameToAssetMeta.get(chunk.fileName);
                    const src = assetMeta?.originalName ?? chunk.name;
                    const asset = createAsset(chunk, src, assetMeta?.isEntry);
                    manifest[src] = asset;
                    fileNameToAsset.set(chunk.fileName, asset);
                }
            }
            // Add deduplicated assets to the manifest
            assets.forEach(({ originalName }, referenceId) => {
                if (!manifest[originalName]) {
                    const fileName = this.getFileName(referenceId);
                    const asset = fileNameToAsset.get(fileName);
                    if (asset) {
                        manifest[originalName] = asset;
                    }
                }
            });
            outputCount++;
            const output = config.build.rollupOptions?.output;
            const outputLength = Array.isArray(output) ? output.length : 1;
            if (outputCount >= outputLength) {
                this.emitFile({
                    fileName: typeof config.build.manifest === 'string'
                        ? config.build.manifest
                        : 'manifest.json',
                    type: 'asset',
                    source: jsonStableStringify(manifest, { space: 2 }),
                });
            }
        },
    };
}

今回は public ディレクトリにモデルを入れる models フォルダと画像や動画を入れる textures フォルダを用意し、それぞれにアセットを入れてます。
ちなみに、アセットとリソースの意味は次のように理解されることが多いです。
リソース：資源、使うモノ
アセット：資産、保有しているモノ
public フォルダに入っているモノとする使用するか決まっていないため、ただ保有しているモノとしてアセットと呼びます。
一方、exportされるモノは使用するか決まっているため、リソースです。
*/

export default[
    {
        name: "room",
        type: "glbModel",
        path: "/models/Finale_version2.glb",
    },
    {
        name: "screen",
        type: "videoTexture",
        path: "/textures/AmongUS_aviutl3.mp4",
    }
]