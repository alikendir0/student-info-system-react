import Table from "./components/Table";
import data from "./students.json";

export default function StudentTable() {
  const columns = [
    {
      Header: "Select",

      Cell: ({ row }) => <input type="checkbox" />,
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Last Name",
      accessor: "lastName",
    },
    {
      Header: "Student Number",
      accessor: "studentNo",
    },
    {
      Header: "ID",
      accessor: "idNo",
    },
    {
      Header: "Courses",
      accessor: "id",
      Cell: ({ row }) => (
        <button onClick={() => alert(`${row.original.courses}`)}>
          Courses
        </button>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} data={data} />
    </>
  );
}
