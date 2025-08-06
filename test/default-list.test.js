import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { expect } from "chai";
import { validateAndParseAddress } from "starknet";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import buildList from "../src/buildList.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));
const schema = JSON.parse(readFileSync(join(__dirname, '../node_modules/@starkdefi/token-lists/dist/tokenlist.schema.json'), 'utf8'));

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validator = ajv.compile(schema);
let defaultTokenList;

before(async function () {
  this.timeout(60000);
  defaultTokenList = await buildList();
});

describe("buildList", () => {
  it("validates", () => {
    expect(validator(defaultTokenList)).to.equal(true);
  });

  it("contains no duplicate addresses", () => {
    const map = {};
    for (let token of defaultTokenList.tokens) {
      const key = `${token.chainId}-${token.address}`;
      expect(typeof map[key]).to.equal("undefined");
      map[key] = true;
    }
  });

  it("contains no duplicate symbols", () => {
    // manual override to approve certain tokens with duplicate symbols
    const approvedDuplicateSymbols = ["ust"];

    const map = {};
    for (let token of defaultTokenList.tokens) {
      let symbol = token.symbol.toLowerCase();
      if (approvedDuplicateSymbols.includes(symbol)) {
        continue;
      } else {
        const key = `${token.chainId}-${symbol}`;
        expect(typeof map[key]).to.equal(
          "undefined",
          `duplicate symbol: ${symbol}`
        );
        map[key] = true;
      }
    }
  });

  it("contains no duplicate names", () => {
    const map = {};
    for (let token of defaultTokenList.tokens) {
      const key = `${token.chainId}-${token.name.toLowerCase()}`;
      expect(typeof map[key]).to.equal(
        "undefined",
        `duplicate name: ${token.name}`
      );
      map[key] = true;
    }
  });

  it("all addresses are valid and checksummed", () => {
    for (let token of defaultTokenList.tokens) {
      expect(validateAndParseAddress(token.address)).to.eq(token.address);
    }
  });

  it("version matches package.json", () => {
    expect(packageJson.version).to.match(/^\d+\.\d+\.\d+$/);
    expect(packageJson.version).to.equal(
      `${defaultTokenList.version.major}.${defaultTokenList.version.minor}.${defaultTokenList.version.patch}`
    );
  });
});
