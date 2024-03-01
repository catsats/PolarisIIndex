import { Box } from "@mui/material";
import Link from "next/link";

export default function Media() {
  const mediaList = [
    {
      title: "开源代码",
      linkText: "Github",
      link: "https://github.com/catsats/PolarisIIndex",
    },
    {
      title: "开发者",
      linkText: "@zisan_xyz",
      link: "https://twitter.com/zisan_xyz",
    },
  ];

  return (
    <div className=" py-4">
      <div className=" flex items-center justify-center gap-x-4 max-sm:flex-col">
        {mediaList.map(({ title, linkText, link }) => {
          return (
            <div
              key={title}
              className=" flex items-center gap-2 text-xl"
            >
              <span>{title}:</span>
              <Box
                component={Link}
                href={link}
                className=" hover:underline"
                sx={{
                  color: "primary.main",
                }}
              >
                {linkText}
              </Box>
            </div>
          );
        })}
      </div>

      <div className=" text-center">
        打赏地址☕️: 0x0f0e63013db1198255ea89126d58592c037a09f0
      </div>
      <div style={{"color": "gold"}} className="text-center">
        不知道脚本怎么配置,关注右边推特和TG群每次打之前都会发配置截图：
        <Box
                component={Link}
                href={"https://twitter.com/zisan_xyz"}
                className=" hover:underline"
                sx={{
                  color: "primary.main",
                }}
              >
                {"@zisan_xyz"}
        </Box>，
        <Box
                component={Link}
                href={"https://t.me/+TCRhtbOUGV1kMmFl"}
                className=" hover:underline"
                sx={{
                  color: "primary.main",
                }}
              >
                {"https://t.me/+TCRhtbOUGV1kMmFl"}
        </Box>
      </div>
    </div>
  );
}
