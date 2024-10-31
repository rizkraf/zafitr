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
import { useEffect, useState, type ReactElement } from "react";
import Head from "next/head";
import { DataTable } from "../../components/data-table";
import { columns } from "../../components/columns/kategori/muzakki";
import { api } from "~/utils/api";
import {
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { useDebounce } from "use-debounce";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import {Loading} from "~/components/loading";
import { Trash } from "lucide-react";
import { useToast } from "~/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { mustahikColumns } from "../../components/columns/kategori/mustahik";
import { useSearchParams } from "next/navigation";

const MuzakkiCategory: NextPageWithLayout = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const paramTabs = searchParams.get("tabs");
  const [search, setSearch] = useState("");
  const [searchDebounce] = useDebounce(search, 500);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [tabActive, setTabActive] = useState("muzakki");

  const { data, isFetching, isRefetching, refetch } =
    api.muzakkiCategory.getList.useQuery({
      pagination,
      search: searchDebounce,
      sorting,
    });
  const {
    data: dataMustahik,
    isFetching: isFetchingMustahik,
    isRefetching: isRefetchingMustahik,
    refetch: refetchMustahik,
  } = api.mustahikCategory.getList.useQuery({
    pagination,
    search: searchDebounce,
    sorting,
  });

  const { mutate, error, isSuccess, isError } =
    api.muzakkiCategory.deleteMany.useMutation();
  const {
    mutate: mutateMustahik,
    error: errorMustahik,
    isSuccess: isSuccessMustahik,
    isError: isErrorMustahik,
  } = api.mustahikCategory.deleteMany.useMutation();

  async function handleDelete() {
    const selectedIds = Object.keys(rowSelection).filter(
      (key) => rowSelection[key],
    );
    mutate(selectedIds);
  }

  async function handleDeleteMustahik() {
    const selectedIds = Object.keys(rowSelection).filter(
      (key) => rowSelection[key],
    );
    mutateMustahik(selectedIds);
  }

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Berhasil menghapus KAtegori Muzakki",
      });
      setRowSelection({});
      void refetch();
    }
  }, [isSuccess, toast, refetch]);

  useEffect(() => {
    if (isError) {
      toast({
        title: error.message,
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  useEffect(() => {
    if (isSuccessMustahik) {
      toast({
        title: "Berhasil menghapus Kategori Mustahik",
      });
      setRowSelection({});
      void refetchMustahik();
    }
  }, [isSuccessMustahik, toast, refetchMustahik]);

  useEffect(() => {
    if (isErrorMustahik) {
      toast({
        title: errorMustahik.message,
        variant: "destructive",
      });
    }
  }, [isErrorMustahik, errorMustahik, toast]);

  useEffect(() => {
    if (tabActive) {
      setSearch("");
      setSorting([{ id: "name", desc: false }]);
      setPagination({ pageIndex: 0, pageSize: 10 });
      setRowSelection({});
    }
  }, [tabActive]);

  useEffect(() => {
    if (paramTabs) {
      setTabActive(paramTabs);
    }
  }, [paramTabs]);

  const buttons = (
    <>
      {tabActive === "muzakki" && (
        <div className="flex flex-row space-x-3">
          {Object.keys(rowSelection).filter((key) => rowSelection[key]).length >
            0 && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash className="h-4 w-4" /> Hapus Kategori Muzakki
            </Button>
          )}
          <Button asChild>
            <Link href="/kategori/muzakki/add">Tambah Kategori Muzakki</Link>
          </Button>
        </div>
      )}
      {tabActive === "mustahik" && (
        <div className="flex flex-row space-x-3">
          {Object.keys(rowSelection).filter((key) => rowSelection[key]).length >
            0 && (
            <Button variant="destructive" onClick={handleDeleteMustahik}>
              <Trash className="h-4 w-4" /> Hapus Kategori Mustahik
            </Button>
          )}
          <Button asChild>
            <Link href="/kategori/mustahik/add">Tambah Kategori Mustahik</Link>
          </Button>
        </div>
      )}
    </>
  );

  return (
    <>
      <Head>
        <title>Kategori Muzakki</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link href="/">Beranda</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Daftar Kategori</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Daftar Kategori
        </h2>
        {isRefetching ||
        isFetching ||
        isRefetchingMustahik ||
        isFetchingMustahik ? (
          <Loading>Loading...</Loading>
        ) : (
          <Tabs
            defaultValue={tabActive}
            className="w-full"
            onValueChange={setTabActive}
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="muzakki">Muzakki</TabsTrigger>
              <TabsTrigger value="mustahik">Mustahik</TabsTrigger>
            </TabsList>
            <TabsContent value="muzakki">
              <div className="container mx-auto">
                <DataTable
                  columns={columns}
                  data={data?.data ?? []}
                  pagination={pagination}
                  setPagination={setPagination}
                  pageCount={data?.meta.totalPage ?? 0}
                  sorting={sorting}
                  setSorting={setSorting}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                  search={search}
                  setSearch={setSearch}
                  searchPlaceholder="Cari Kategori Muzakki"
                  buttons={buttons}
                />
              </div>
            </TabsContent>
            <TabsContent value="mustahik">
              <div className="container mx-auto">
                <DataTable
                  columns={mustahikColumns}
                  data={dataMustahik?.data ?? []}
                  pagination={pagination}
                  setPagination={setPagination}
                  pageCount={dataMustahik?.meta.totalPage ?? 0}
                  sorting={sorting}
                  setSorting={setSorting}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                  search={search}
                  setSearch={setSearch}
                  searchPlaceholder="Cari Kategori Mustahik"
                  buttons={buttons}
                />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
};

MuzakkiCategory.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default MuzakkiCategory;
