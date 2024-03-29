import { defineChain } from "viem";
import {
  arbitrum,
  avalanche,
  base,
  bsc,
  celo,
  classic,
  confluxESpace,
  coreDao,
  cronos,
  eos,
  fantom,
  filecoin,
  gnosis,
  iotex,
  klaytn,
  linea,
  mainnet,
  mantle,
  meter,
  neonMainnet,
  okc,
  opBNB,
  optimism,
  polygon,
  sepolia,
  zkSync,
  bscTestnet
} from "viem/chains";

export const shibarium = defineChain({
  id: 109,
  name: "Shibarium",
  network: "shibarium",
  nativeCurrency: {
    decimals: 18,
    name: "BONE",
    symbol: "BONE",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.shibrpc.com"],
    },
    public: {
      http: ["https://rpc.shibrpc.com"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://shibariumscan.io" },
  },
});

export const ethw = defineChain({
  id: 10001,
  name: "ETHW-mainnet",
  network: "ETHW-mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "ETHW",
    symbol: "ETHW",
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet.ethereumpow.org"],
    },
    public: {
      http: ["https://mainnet.ethereumpow.org"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://mainnet.ethwscan.com" },
  },
});

export const kcc = defineChain({
  id: 321,
  name: "KCC Mainnet",
  network: "KCC Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "KCS",
    symbol: "KCS",
  },
  rpcUrls: {
    default: {
      http: ["https://kcc-rpc.com"],
    },
    public: {
      http: ["https://kcc-rpc.com"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer.kcc.io/en" },
  },
});

export const mapo = defineChain({
  id: 22776,
  name: "MAP Mainnet",
  network: "MAP Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "MAPO",
    symbol: "MAPO",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.maplabs.io"],
    },
    public: {
      http: ["https://rpc.maplabs.io"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://mapscan.io" },
  },
});

export const Combo = defineChain({
  id: 9980,
  name: "Combo Mainnet",
  network: "Combo Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "BNB",
    symbol: "BNB",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.combonetwork.io"],
    },
    public: {
      http: ["https://rpc.combonetwork.io"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://combonetwork.io/" },
  },
});

export const BEVM = defineChain({
  id: 1501,
  name: "BEVM",
  network: "BEVM",
  nativeCurrency: {
    decimals: 18,
    name: "BTC",
    symbol: "BTC",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-1.bevm.io"],
    },
    public: {
      http: ["https://rpc-1.bevm.io"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://scan.bevm.io" },
  },
});

export const Metis = defineChain({
  id: 1088,
  name: "Metis Andromeda Mainnet",
  network: "Metis Andromeda Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "METIS",
    symbol: "METIS",
  },
  rpcUrls: {
    default: {
      http: ["https://metis-pokt.nodies.app"],
    },
    public: {
      http: ["https://metis-pokt.nodies.app"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer.metis.io" },
  },
});

export const Zeta = defineChain({
  id: 7000,
  name: "ZetaChain Mainnet",
  network: "ZetaChain Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "ZETA",
    symbol: "ZETA",
  },
  rpcUrls: {
    default: {
      http: ["https://zetachain-mainnet-archive.allthatnode.com:8545"],
    },
    public: {
      http: ["https://zetachain-mainnet-archive.allthatnode.com:8545"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://zetachain.blockscout.com" },
  },
});

export const Merlin = defineChain({
  id: 4200,
  name: "Merlin Mainnet",
  network: "Merlin Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "BTC",
    symbol: "BTC",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.merlinchain.io"],
    },
    public: {
      http: ["https://rpc.merlinchain.io"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://scan.merlinchain.io/" },
  },
});

export const Blast = defineChain({
  id: 81457,
  name: "Blast",
  network: "Blast",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.blast.io"],
    },
    public: {
      http: ["https://rpc.blast.io"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://blastscan.io/" },
  },
});

export const inscriptionChains = {
  eth: mainnet,
  Merlin,
  Blast,
  bsc,
  opBNB,
  Zeta,
  polygon,
  fantom,
  avalanche,
  arbitrum,
  optimism,
  base,
  zkSync,
  classic,
  meter,
  iotex,
  klaytn,
  mantle,
  mapo,
  cronos,
  kcc,
  coreDao,
  ethw,
  eos,
  neonMainnet,
  linea,
  celo,
  confluxESpace,
  gnosis,
  filecoin,
  shibarium,
  sepolia,
  Combo,
  BEVM,
  bscTestnet,
  Metis
};

export type ChainKey = keyof typeof inscriptionChains;
