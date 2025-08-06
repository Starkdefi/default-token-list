import packageJson from "../package.json" assert { type: "json" };
import mainnet from "./tokens/mainnet.json" assert { type: "json" };
import sepolia from "./tokens/sepolia.json" assert { type: "json" };

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
