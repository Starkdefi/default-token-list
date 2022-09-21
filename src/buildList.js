const { version } = require("../package.json");
const mainnet = require("./tokens/mainnet.json");
const goerli = require("./tokens/goerli.json");

module.exports = function buildList() {
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
    tokens: [...mainnet, ...goerli]
      // sort them by symbol for easy readability
      .sort((t1, t2) => {
        if (t1.chainId === t2.chainId) {
          return t1.symbol.toLowerCase() < t2.symbol.toLowerCase() ? -1 : 1;
        }
        return t1.chainId < t2.chainId ? -1 : 1;
      }),
  };
  return Promise.resolve(list);
};
