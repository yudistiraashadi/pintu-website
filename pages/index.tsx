import Head from "next/head";
import { Inter } from "next/font/google";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

import axios from "axios";

import { useQuery, useQueryClient } from "react-query";

export default function Home() {
  const [sortBy, setSortBy] = React.useState("default");

  const pricesQuery = useQuery<any, Error>(
    "prices",
    async () => {
      const res = await axios.get(
        "https://api.pintu.co.id/v2/trade/price-changes"
      );
      return res.data.payload;
    },
    {
      refetchInterval: 2000,
    }
  );

  const currencyQuery = useQuery<any, Error>("currencies", async () => {
    const res = await axios.get(
      "https://api.pintu.co.id/v2/wallet/supportedCurrencies"
    );
    return res.data.payload;
  });

  const _renderList = () => {
    if (pricesQuery.isLoading || currencyQuery.isLoading)
      return <p>Loading...</p>;

    if (pricesQuery.isError) return <p>Error: {pricesQuery.error.message}</p>;

    if (currencyQuery.isError)
      return <p>Error: {currencyQuery.error.message}</p>;

    return (
      <div className="relative overflow-x-auto">
        <table className="hidden md:table w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col"></th>
              <th scope="col" className="px-6 py-3">
                Cryto
              </th>
              <th scope="col" className="px-6 py-3">
                Harga
              </th>
              <th scope="col" className="px-6 py-3">
                24 Jam
              </th>
              <th scope="col" className="px-6 py-3">
                1 MGG
              </th>
              <th scope="col" className="px-6 py-3">
                1 BLN
              </th>
              <th scope="col" className="px-6 py-3">
                1 THN
              </th>
            </tr>
          </thead>
          <tbody>
            {currencyQuery.data
              .filter((i) => i.currencyGroup !== "IDR")
              .map((currency) => {
                let pricePair = currency.currencyGroup.toLowerCase() + "/idr";
                let price = pricesQuery.data.find(
                  (item) => item.pair == pricePair
                );

                return (
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <div
                        className={
                          "w-12 h-12 rounded-full flex items-center justify-center"
                        }
                        style={{ backgroundColor: currency.color }}
                      >
                        <p className="text-white text-xs">
                          {currency.currencySymbol}
                        </p>
                      </div>
                    </th>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold">{currency.name}</p>

                        <p>{currency.currencyGroup}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      Rp {Intl.NumberFormat("id-ID").format(price.latestPrice)}
                    </td>
                    <td className="px-6 py-4">{price.day} %</td>
                    <td className="px-6 py-4">{price.week} %</td>
                    <td className="px-6 py-4">{price.month} %</td>
                    <td className="px-6 py-4">{price.year} %</td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <div className="block md:hidden">
          {currencyQuery.data
            .filter((i) => i.currencyGroup !== "IDR")
            .map((currency) => {
              let pricePair = currency.currencyGroup.toLowerCase() + "/idr";
              let price = pricesQuery.data.find(
                (item) => item.pair == pricePair
              );

              return (
                <div
                  key={currency.currencyGroup}
                  className="flex flex-row w-full items-center px-4 py-2 bg-white border-b border-gray-300"
                >
                  {/* icon */}
                  <div
                    className={
                      "w-12 h-12 rounded-full flex items-center justify-center"
                    }
                    style={{ backgroundColor: currency.color }}
                  >
                    <p className="text-white text-xs">
                      {currency.currencySymbol}
                    </p>
                  </div>

                  {/* name */}
                  <div className="flex flex-1 flex-col items-start px-4">
                    <p className="font-bold">{currency.name}</p>

                    <p>{currency.currencyGroup}</p>
                  </div>

                  {/* price */}
                  <div className="flex flex-col px-2 justify-end items-end">
                    <p className="font-bold">
                      Rp {Intl.NumberFormat("id-ID").format(price.latestPrice)}
                    </p>

                    <p>{price.day} %</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Pintu - Assessment Test</title>
        <meta name="description" content="Pintu Assessment Test" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div className="w-100 pt-4 text-center">{_renderList()}</div>
      </main>
    </>
  );
}
