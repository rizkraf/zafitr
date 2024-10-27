import MainLayout from "~/components/main-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import type { NextPageWithLayout } from "../_app";
import { useState, type ReactElement } from "react";
import Head from "next/head";
import { DataTable } from "../../components/data-table";
import { columns } from "./columns";
import { api } from "~/utils/api";
import { type SortingState } from "@tanstack/react-table";
import { useDebounce } from "use-debounce";

const Muzakki: NextPageWithLayout = () => {
  const [search, setSearch] = useState("");
  const [searchDebounce] = useDebounce(search, 500);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const data = api.muzakki.list.useQuery({
    pagination,
    search: searchDebounce,
    sorting,
  }).data;

  return (
    <>
      <Head>
        <title>Muzakki</title>
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
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Muzakki</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Daftar Muzakki
        </h2>
        <div className="container mx-auto">
          <DataTable
            columns={columns}
            data={data?.data ?? []}
            pagination={pagination}
            setPagination={setPagination}
            pageCount={data?.meta.totalPage ?? 0}
            sorting={sorting}
            setSorting={setSorting}
            search={search}
            setSearch={setSearch}
            searchPlaceholder="Cari Muzakki"
          />
        </div>
      </div>
    </>
  );
};

Muzakki.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Muzakki;
