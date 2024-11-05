import MainLayout from "~/components/main-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import type { NextPageWithLayout } from "./_app";
import { useState, type ReactElement } from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/utils/api";
import { formatedCurrency } from "~/utils/parse";
import { Skeleton } from "~/components/ui/skeleton";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const Home: NextPageWithLayout = () => {
  const [idPeriod, setIdPeriod] = useState("");

  const { data: dataRecord, isFetching: isFetchingRecord } =
    api.zakatRecord.totalAmount.useQuery();
  const { data: dataDistribution, isFetching: isFetchingDistribution } =
    api.zakatDistribution.totalAmount.useQuery();
  const { data: dataMuzakki, isFetching: isFetchingMuzakki } =
    api.muzakki.total.useQuery();
  const { data: dataMustahik, isFetching: isFetchingMustahik } =
    api.mustahik.total.useQuery();

  const period = api.zakatPeriod.getAll.useQuery().data;

  const { data: chartData } =
    api.statistic.getRecordAndDistributionStatisticByPeriod.useQuery({
      periodId: idPeriod,
    });

  const chartConfig = {
    amount: {
      label: "Jumlah",
    },
    record: {
      label: "Penerimaan",
      color: "hsl(var(--chart-1))",
    },
    distribution: {
      label: "Distribusi",
      color: "hsl(var(--chart-2))",
    },
    label: {
      label: "Label",
      color: "hsl(var(--background))",
    },
  } satisfies ChartConfig;

  return (
    <>
      <Head>
        <title>Beranda</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Beranda</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Jumlah Penerimaan Zakat</CardTitle>
            </CardHeader>
            <CardContent>
              {isFetchingRecord ? (
                <Skeleton className="h-7 rounded-sm" />
              ) : (
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  {formatedCurrency(dataRecord ?? 0)}
                </h4>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Jumlah Distribusi Zakat</CardTitle>
            </CardHeader>
            <CardContent>
              {isFetchingDistribution ? (
                <Skeleton className="h-7 rounded-sm" />
              ) : (
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  {formatedCurrency(dataDistribution ?? 0)}
                </h4>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Jumlah Muzakki</CardTitle>
            </CardHeader>
            <CardContent>
              {isFetchingMuzakki ? (
                <Skeleton className="h-7 rounded-sm" />
              ) : (
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  {`${dataMuzakki} orang`}
                </h4>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Jumlah Mustahik</CardTitle>
            </CardHeader>
            <CardContent>
              {isFetchingMustahik ? (
                <Skeleton className="h-7 rounded-sm" />
              ) : (
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  {`${dataMustahik} orang`}
                </h4>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="min-h-[100vh] md:min-h-min">
          <Card>
            <CardHeader className="flex gap-2 space-y-0 border-b py-5 sm:flex-row sm:items-center">
              <div className="grid flex-1 gap-1">
                <CardTitle>Statistik Penerimaan dan Distribusi Zakat</CardTitle>
              </div>
              <Select value={idPeriod} onValueChange={setIdPeriod}>
                <SelectTrigger
                  className="w-[160px] rounded-lg sm:ml-auto"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Pilih periode..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {period?.data.map((prd) => (
                    <SelectItem
                      key={prd.id}
                      value={prd.id}
                      className="rounded-lg"
                    >
                      {prd.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  layout="vertical"
                  margin={{
                    left: 0,
                  }}
                >
                  <YAxis
                    dataKey="zakat"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value: string) => value.slice(0, 3)}
                    hide
                  />
                  <XAxis dataKey="amount" type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        indicator="line"
                        formatter={(value, name) => (
                          <div className="flex min-w-[130px] items-center text-xs text-muted-foreground">
                            {chartConfig[name as keyof typeof chartConfig]
                              ?.label || name}
                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                              {formatedCurrency(Number(value))}
                            </div>
                          </div>
                        )}
                      />
                    }
                  />
                  <Bar dataKey="amount" layout="vertical" radius={5}>
                    <LabelList
                      dataKey="zakat"
                      position="insideLeft"
                      offset={8}
                      className="fill-[--color-label]"
                      fontSize={14}
                      fontWeight={500}
                    />
                    <LabelList
                      dataKey="amount"
                      position="insideRight"
                      offset={8}
                      className="fill-[--color-label]"
                      fontSize={14}
                      fontWeight={500}
                      formatter={formatedCurrency}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
