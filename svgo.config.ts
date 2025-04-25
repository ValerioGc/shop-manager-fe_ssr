export interface PluginConfig {
    name: string;
    active?: boolean;
    params?: Record<string, any>;
}

export const plugins: PluginConfig[] = [
    { name: 'removeViewBox', active: false },
    { name: 'removeDimensions', active: true },
    { name: 'cleanupIDs', active: true },
    { name: 'removeComments', active: true },
    { name: 'removeMetadata', active: true },
    { name: 'convertColors', active: true },
    { name: 'collapseGroups', active: true },
    { name: 'removeUnusedNS', active: true },
    { name: 'convertShapeToPath', active: true },
    { name: 'mergePaths', active: true },
    { name: 'minifyStyles', active: true },
    { name: 'removeEmptyContainers', active: true },
    { name: 'removeTitle', active: true },
    { name: 'removeDesc', active: true },
    { name: 'removeUselessStrokeAndFill', active: true },
    { name: 'convertStyleToAttrs', active: true },
    { name: 'removeAttrs', params: { attrs: '(stroke|fill)' } } 
];
