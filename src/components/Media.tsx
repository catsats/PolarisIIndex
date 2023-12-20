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
        打赏地址☕️: 0x3d9d43182843e9cc66b18482cb99b8d2f8258900
      </div>
    </div>
  );
}
