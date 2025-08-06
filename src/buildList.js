import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));
const mainnet = JSON.parse(readFileSync(join(__dirname, './tokens/mainnet.json'), 'utf8'));
const sepolia = JSON.parse(readFileSync(join(__dirname, './tokens/sepolia.json'), 'utf8'));

export default function buildList() {
  const { version } = packageJson;
  const parsed = version.split(".");
  const list = {
    name: "StarkDefi Default",
    timestamp: new Date().toISOString(),
    version: {
      major: +parsed[0],
      minor: +parsed[1],
      patch: +parsed[2],
    },
    tags: {},
    logoURI: "ipfs://QmYVm6z2TmQYzhG1rV6jHi8nfE9a5HSFAy9vSE1ruBvRZd",
    keywords: ["starkdefi", "default"],
    tokens: [...mainnet, ...sepolia]
      // sort them by symbol for easy readability
      .sort((t1, t2) => {
        if (t1.chainId === t2.chainId) {
          return t1.symbol.toLowerCase() < t2.symbol.toLowerCase() ? -1 : 1;
        }
        return t1.chainId < t2.chainId ? -1 : 1;
      }),
  };
  return Promise.resolve(list);
}
