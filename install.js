import { cp, readdir } from 'fs/promises';
import path from 'path';

const moduleRoot = path.join('.', 'node_modules', 'mermaid', 'dist');
const pluginJsFolder = path.join('.', 'js');

/** Copy the main mermaid.min.js */
await cp(path.join(moduleRoot, 'mermaid.min.js'), path.join(pluginJsFolder, 'mermaid.min.js'));
