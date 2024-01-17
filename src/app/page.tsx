"use client"

import {
  Button,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useCallback, useRef, useState,useEffect } from "react";
import {
  Chain,
  createWalletClient,
  Hex,
  http,
  isAddress,
  parseEther,
  SendTransactionErrorType,
  stringToHex,
  webSocket,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

import Log from "@/components/Log";
import { ChainKey, inscriptionChains } from "@/config/chains";
import useInterval from "@/hooks/useInterval";
import { handleAddress, handleLog } from "@/utils/helper";
import Handlebars from 'handlebars';
import { v4 as uuidv4 } from 'uuid';

const example =
  'data:,{"p":"asc-20","op":"mint","tick":"aval","amt":"100000000"}';
const exampleid =
  'data:,{"p":"asc-20","op":"mint","tick":"aval","id":"{{uuid}}","amt":"100000000"}';
type RadioType = "meToMe" | "manyToOne";
type RadioidType = "noid" | "haveid";
type GasRadio = "all" | "tip";
type randomIDType = "rangeid" | "specifyid";

export default function Home() {
  const [chain, setChain] = useState<Chain>(mainnet);
  const [privateKeys, setPrivateKeys] = useState<Hex[]>([]);
  const [radio, setRadio] = useState<RadioType>("meToMe");
  const [radioid, setRadioid] = useState<RadioidType>("noid");
  const [toAddress, setToAddress] = useState<Hex>();
  const [rpc, setRpc] = useState<string>();
  const [inscription, setInscription] = useState<string>("");
  const [gas, setGas] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const [delay, setDelay] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [successCount, setSuccessCount] = useState<number>(0);
  const [gasRadio, setGasRadio] = useState<GasRadio>("tip");
  const [sendValue, setSendValue] = useState<string>("0");
  const [randomid, setRandomid] = useState<randomIDType>("rangeid");
  
  const [minid, setMinid] = useState<number>(1);
  const [maxid, setMaxid] = useState<number>(1000000);
  const [idlist, setIdlist] = useState<Array<number>>([]); //id列表
  
  const listidRef = useRef<Array<number>>([]);
  const listIndexRef = useRef<number>(0);

  const inscriptionRef = useRef<string>('');

  const pushLog = useCallback((log: string, state?: string) => {
    setLogs((logs) => [
      handleLog(log, state),
      ...(logs.length >= 1000 ? logs.slice(0, 1000) : logs),
    ]);
  }, []);

  const client = createWalletClient({
    chain,
    transport: rpc && rpc.startsWith("wss") ? webSocket(rpc) : http(rpc),
  });
  const accounts = privateKeys.map((key) => privateKeyToAccount(key));

  //生成id值1-1000000
  const randomidnum:any = (min: number, max: number) => {
    const randomInteger:number = Math.floor(Math.random() * (max - min + 1)) + min;
    if(!listidRef.current.includes(randomInteger)){
      listidRef.current.push(randomInteger);
      return randomInteger;
    }else {
      let idnum = maxid-minid+1; //可以打的id数量
      let alreaid = listidRef.current.length; //已经打的id数量
      if(alreaid >= idnum){
        return;
      }else {
        return randomidnum(min,max);
      }
    }
  }

  //返回指定值
  const specifyidnum = () => {
    let idnum = idlist[listIndexRef.current]; //可以打的id数量
    listIndexRef.current += 1;
    return idnum;
  }

  useEffect(()=>{
    if(running == false) {
      listidRef.current = [];
      listIndexRef.current = 0;
    }
  },[running,randomid])

  useInterval(
    async () => {
      const results = await Promise.allSettled(
        accounts.map((account) => {
          let uuid = null;
          if(radioid == "haveid") { //id模式
            if(randomid == "rangeid") { //指定范围id模式
              let idnum = maxid-minid+1; 
              let alreaid = listidRef.current.length; 
              if(alreaid >= idnum){
                setRunning(false);
                pushLog(`选定的id已打完`, "success");
                return;
              }
              uuid = randomidnum(minid,maxid);
            }
            if(randomid == "specifyid"){ //指定id模式
              if(listIndexRef.current >= idlist.length){
                setRunning(false);
                pushLog(`指定的id已打完`, "success");
                return;
              }
              uuid = specifyidnum();
            }

            let template = Handlebars.compile(inscription);
            let templateData = { "uuid": `${uuid}` };
            let tokenJson = template(templateData);
            inscriptionRef.current = tokenJson;
            console.log("当前id",uuid,tokenJson);
          }
          return client.sendTransaction({
            account,
            to: radio === "meToMe" ? account.address : toAddress,
            value: parseEther(sendValue),
            ...(inscriptionRef.current
              ? {
                  data: stringToHex(inscriptionRef.current),
                }
              : {}),
            ...(gas > 0
              ? gasRadio === "all"
                ? {
                    gasPrice: parseEther(gas.toString(), "gwei"),
                  }
                : {
                    maxPriorityFeePerGas: parseEther(gas.toString(), "gwei"),
                  }
              : {}),
          });
        }),
      );
      results.forEach((result, index) => {
        const address = handleAddress(accounts[index].address);
        if (result.status === "fulfilled") {
          pushLog(`${address} ${result.value}`, "success");
          setSuccessCount((count) => count + 1);
        }
        if (result.status === "rejected") {
          const e = result.reason as SendTransactionErrorType;
          let msg = `${e.name as string}: `;
          if (e.name === "TransactionExecutionError") {
            msg = msg + e.details;
          }
          if (e.name == "Error") {
            msg = msg + e.message;
          }
          pushLog(`${address} ${msg}`, "error");
        }
      });
    },
    running ? delay : null,
  );

  const run = useCallback(() => {
    if (privateKeys.length === 0) {
      pushLog("没有私钥", "error");
      setRunning(false);
      return;
    }

    if (radio === "manyToOne" && !toAddress) {
      pushLog("没有地址", "error");
      setRunning(false);
      return;
    }

    // if (!inscription) {
    //   setLogs((logs) => [handleLog("没有铭文", "error"), ...logs]);
    //   setRunning(false);
    //   return;
    // }

    setRunning(true);
  }, [privateKeys.length, pushLog, radio, toAddress]);

  return (
    <div className=" flex flex-col gap-4">
      <div className=" flex flex-col gap-2">
        <span>链（选要打铭文的链）:</span>
        <TextField
          select
          defaultValue="eth"
          size="small"
          disabled={running}
          onChange={(e) => {
            const text = e.target.value as ChainKey;
            setChain(inscriptionChains[text]);
          }}
        >
          {Object.entries(inscriptionChains).map(([key, chain]) => (
            <MenuItem
              key={chain.id}
              value={key}
            >
              {chain.name}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div className=" flex flex-col gap-2">
        <span>私钥（必填，单个钱包打，多个钱包请多开窗口）:</span>
        <TextField
          multiline
          minRows={2}
          size="small"
          placeholder="私钥，带不带 0x 都行，程序会自动处理"
          disabled={running}
          onChange={(e) => {
            const text = e.target.value;
            const lines = text.split("\n");
            const keys = lines
              .map((line) => {
                const key = line.trim();
                if (/^[a-fA-F0-9]{64}$/.test(key)) {
                  return `0x${key}`;
                }
                if (/^0x[a-fA-F0-9]{64}$/.test(key)) {
                  return key as Hex;
                }
              })
              .filter((x) => x) as Hex[];
            setPrivateKeys(keys);
          }}
        />
      </div>

      <RadioGroup
        row
        defaultValue="meToMe"
        onChange={(e) => {
          const value = e.target.value as RadioType;
          setRadio(value);
        }}
      >
        <FormControlLabel
          value="meToMe"
          control={<Radio />}
          label="自己转自己"
          disabled={running}
        />
        <FormControlLabel
          value="manyToOne"
          control={<Radio />}
          label="转其他地址"
          disabled={running}
        />
      </RadioGroup>

      {radio === "manyToOne" && (
        <div className=" flex flex-col gap-2">
          <span>转给谁的地址（必填）:</span>
          <TextField
            size="small"
            placeholder="地址"
            disabled={running}
            onChange={(e) => {
              const text = e.target.value;
              isAddress(text) && setToAddress(text);
            }}
          />
        </div>
      )}

      <RadioGroup
        row
        defaultValue="noid"
        onChange={(e) => {
          const value = e.target.value as RadioidType;
          setRadioid(value);
        }}
      >
        <FormControlLabel
          value="noid"
          control={<Radio />}
          label="默认铭文"
          disabled={running}
        />
        <FormControlLabel
          value="haveid"
          control={<Radio />}
          label="铭文动态id模式"
          disabled={running}
        />
      </RadioGroup>

      {radioid == "noid" && <div className=" flex flex-col gap-2">
        <span>铭文（选填，原始铭文，不是转码后的十六进制）:</span>
        <TextField
          size="small"
          placeholder={`铭文，不要输入错了，多检查下，例子：\n${example}`}
          disabled={running}
          onChange={(e) => {
            const text = e.target.value;
            setInscription(text.trim());
            inscriptionRef.current = text.trim();
          }}
        />
      </div>
    }

    {radioid == "haveid" && <>
    <div className=" flex flex-col gap-2">
        <span>铭文+id（选填，原始铭文，不是转码后的十六进制）:</span>
        <TextField
          size="small"
          placeholder={`铭文，不要输入错了，多检查下，例子：\n${exampleid}`}
          disabled={running}
          onChange={(e) => {
            const text = e.target.value;
            setInscription(text.trim());
          }}
        />
      </div>
      <RadioGroup
        row
        defaultValue="rangeid"
        onChange={(e) => {
          const value = e.target.value as randomIDType;
          setRandomid(value);
        }}
      >
        <FormControlLabel
          value="rangeid"
          control={<Radio />}
          label="指定范围id"
          disabled={running}
        />
        <FormControlLabel
          value="specifyid"
          control={<Radio />}
          label="指定id"
          disabled={running}
        />
      </RadioGroup>
      <a href="https://twitter.com/zisan_xyz/status/1747252537840095430" style={{color: "#90caf9"}}>id查重教程 - 道士钟发白</a>
      {
        randomid == "rangeid" && <>
          <div className="flex flex-col gap-2">
            <span>id范围是1-1000000中的随机id（默认范围有打重的风险，建议指定id范围避免打重复）</span>
            <TextField
              size="small"
              placeholder="选填：1"
              disabled={running}
              onChange={(e) => {
                const id = Number(e.target.value);
                setMinid(id);
              }}
            />
            <TextField
              size="small"
              placeholder="选填：1000000 （填入的是铭文的最大张数）"
              disabled={running}
              onChange={(e) => {
                const id = Number(e.target.value);
                setMaxid(id);
              }}
            />
        </div>
        </>
      }

      {
        randomid == "specifyid" && <>
          <div className="flex flex-col gap-2">
            <span>打指定id 用英文,逗号分隔开来</span>
            <TextField
              multiline
              minRows={2}
              size="small"
              placeholder="例子：324,123,453,2655433,2355"
              disabled={running}
              onChange={(e) => {
                const text = e.target.value;
                const lines = text.split(",");
                const lists = lines.map((items) => {
                  return Number(items);
                })
                setIdlist(lists);
              }}
            />
        </div>
        </>
      }
    </>

      
    }

      <div className=" flex flex-col gap-2">
        <span>
          RPC (选填, 默认公共有瓶颈经常失败, 最好用付费的, http 或者 ws 都可以):
        </span>
        <a target="_blank" href="https://twitter.com/zisan_xyz/status/1736586479013634511" style={{color: "#90caf9"}}>《RPC链接寻找教程》 ps:请关注开发者发出更多开源脚本 - 道士钟发白</a>
        <TextField
          size="small"
          placeholder="RPC 默认能不填，有自己的PRC节点可以填进去"
          disabled={running}
          onChange={(e) => {
            const text = e.target.value;
            setRpc(text);
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span>
          发送代币数量:
        </span>
        <TextField
          size="small"
          placeholder="0"
          disabled={running}
          onChange={(e) => {
            const text = e.target.value;
            setSendValue(text);
          }}
          defaultValue="0"
        />
      </div>

      <RadioGroup
        row
        defaultValue="tip"
        onChange={(e) => {
          const value = e.target.value as GasRadio;
          setGasRadio(value);
        }}
      >
        <FormControlLabel
          value="tip"
          control={<Radio />}
          label="额外矿工小费"
          disabled={running}
        />
        <FormControlLabel
          value="all"
          control={<Radio />}
          label="总 gas"
          disabled={running}
        />
      </RadioGroup>

      <div className=" flex flex-col gap-2">
        <span>{gasRadio === "tip" ? "额外矿工小费" : "总 gas"} (选填):</span>
        <TextField
          type="number"
          size="small"
          placeholder={`${
            gasRadio === "tip" ? "默认 0" : "默认最新"
          }, 单位 gwei，例子: 10`}
          disabled={running}
          onChange={(e) => {
            const num = Number(e.target.value);
            !Number.isNaN(num) && num >= 0 && setGas(num);
          }}
        />
      </div>

      <div className=" flex flex-col gap-2">
        <span>每笔交易间隔时间 1秒=1000ms (选填, 最低 0 ms):</span>
        <TextField
          type="number"
          size="small"
          placeholder="默认 0 ms"
          disabled={running}
          onChange={(e) => {
            const num = Number(e.target.value);
            !Number.isNaN(num) && num >= 0 && setDelay(num);
          }}
        />
      </div>

      <Button
        variant="contained"
        color={running ? "error" : "success"}
        onClick={() => {
          if (!running) {
            run();
          } else {
            setRunning(false);
          }
        }}
      >
        {running ? "运行中" : "运行"}
      </Button>

      <Log
        title={`日志（成功次数 => ${successCount}）:`}
        logs={logs}
        onClear={() => {
          setLogs([]);
        }}
      />
    </div>
  );
}
