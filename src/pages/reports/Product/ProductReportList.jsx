import React, { useContext, useEffect, useRef, useState } from 'react'
import Layout from '../../../layout/Layout'
import ReportFilter from '../../../components/ReportFilter'
import { ContextPanel } from '../../../utils/ContextPanel';
import { useNavigate } from 'react-router-dom';
import MUIDataTable from 'mui-datatables';
import { IconButton } from '@mui/material';
import { FaRegFilePdf } from 'react-icons/fa';
import axios from 'axios';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import BASE_URL from '../../../base/BaseUrl';

const ProductReportList = () => {
    const [productReport, setProductReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchProductReprot = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-product-report-list`,


     
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProductReport(response.data?.products);
      } catch (error) {
        console.error("Error fetching product report data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductReprot();
    setLoading(false);
  }, []);

  const handleSavePDF = () => {
    const input = tableRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("product-report.pdf");
    });
  };
  const columns = [
    {
      name: "product_category",
      label: "Category",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "product_sub_category",
      label: "Sub Category",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "products_brand",
      label: "Brand",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
        name: "products_thickness",
        label: "Thickness",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value, tableMeta) => {
            const products_thickness = tableMeta.rowData[3];
            const products_unit = tableMeta.rowData[4];
            return `${products_thickness} ${products_unit}`;
          },
        },
      },
      {
        name: "products_unit",
        label: "Unit",
        options: {
          display: false,
        },
      },
      {
        name: "products_size1",
        label: "Size",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value, tableMeta) => {
            const products_size1 = tableMeta.rowData[5];
            const products_size2 = tableMeta.rowData[6];
            return `${products_size1}x${products_size2} `;
          },
        },
      },
      {
        name: "products_size2",
        label: "size2",
        options: {
          display: false,
        },
      },
      {
        name: "products_size_unit",
        label: "size unit",
        options: {
          display: false,
        },
      },
      {
        name: "products_rate",
        label: "Rate",
        options: {
          filter: true,
          sort: false,
        },
      },
    
    {
      name: "product_status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
      },
    },
    

    
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    pagination: false,
    search: false,
    filter: false,
    rowsPerPage: 100000, // Set to a large number to show all rows
    rowsPerPageOptions: [], // Empty array to hide rows per page dropdown
    // rowsPerPage: 5,
    // rowsPerPageOptions: [5, 10, 25],
    responsive: "standard",
    viewColumns: false,
    // Add custom toolbar for PDF export
    // Add custom toolbar for PDF export
    customToolbar: () => {
      return (
        <IconButton
          onClick={handleSavePDF}
          title="Save as PDF"
          className="bg-white text-black"
        >
          <FaRegFilePdf className="w-5 h-5" />

        </IconButton>
      );
    },
  };

  return (
   <Layout>
    <ReportFilter/>
    <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Product Report
        </h3>
      </div>

      <div className="mt-5" ref={tableRef}>
        <MUIDataTable
          data={productReport ? productReport : []}
          columns={columns}
          options={options}
        />
      </div>
   </Layout>
  )
}

export default ProductReportList