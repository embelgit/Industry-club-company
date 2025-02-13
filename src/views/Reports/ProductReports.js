import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import DataNotPresent from '../components/DataNotPresent';
import { CCardHeader, CTable, CButton } from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilPencil, cilTrash, cilChevronLeft, cilChevronRight } from '@coreui/icons';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReactPaginate from 'react-paginate';


const ProductReports = () => {
  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Adjust this value as needed

  const getData = async () => {
    try {
      setLoader(true);
      // Simulated data fetching
      const data = [
        {
          industriesName: 'Industry 1',
          productCatogory: 'Category 1',
          subCategory: 'SubCategory 1',
          productName: 'Product 1',
          image: 'image1.jpg',
          price: '100',
          off: '10%',
          gst: '9%',
          amount: '90',
          totalPrice: '190',
          discription: 'Description 1'
        },
        {
          industriesName: 'Industry 2',
          productCatogory: 'Category 2',
          subCategory: 'SubCategory 2',
          productName: 'Product 2',
          image: 'image2.jpg',
          price: '200',
          off: '15%',
          gst: '18%',
          amount: '170',
          totalPrice: '370',
          discription: 'Description 2'
        },
        {
          industriesName: 'Industry 3',
          productCatogory: 'Category 3',
          subCategory: 'SubCategory 3',
          productName: 'Product 3',
          image: 'image3.jpg',
          price: '300',
          off: '5%',
          gst: '18%',
          amount: '285',
          totalPrice: '585',
          discription: 'Description 3'
        },
      ];
      setTableData(data);
      setCategories([...new Set(data.map(item => item.productCatogory))]);
    } catch (error) {
      console.log('getUserList error :-', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(0);
  };
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  const filteredData = selectedCategory
    ? tableData.filter(item => item.productCatogory === selectedCategory)
    : tableData;

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredData.slice(offset, offset + itemsPerPage);

  const exportPDF = () => {
    const input = document.getElementById('product-report-table');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10);
      pdf.save('product-report.pdf');
    });
  };

  return (
    <>
      <div className="card shadow">
        <CCardHeader>
          <strong>PRODUCT Reports</strong>
        </CCardHeader>
        <div className="card-body">
          <br />
          {loader ? (
            <Loader />
          ) : (
            <>
              <div className="d-flex justify-content-between mb-3">
                <select onChange={handleCategoryChange} value={selectedCategory} className="form-select w-25">
                  <option value="">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
                <div>
                  <CSVLink data={filteredData} filename={"product-report.csv"} className="me-3" style={{color: "navy"}}>
                    CSV
                  </CSVLink>
                  <CButton color="primary" onClick={exportPDF}>PDF</CButton>
                </div>
              </div>
              {filteredData.length ? (
                <>
                  <div className="table-responsive">
                    <CTable striped id="product-report-table">
                      <thead className="table-success table-bordered table-striped">
                        <tr>
                          <th scope="col">Sr_No.</th>
                          <th scope="col">Industries_Name</th>
                          {/* <th scope="col">Product_Category</th>
                          <th scope="col">Sub_Category</th> */}
                          <th scope="col">Product_Name</th>
                          <th scope="col">Image</th>
                          <th scope="col">Price</th>
                          <th scope="col">Off_(%)</th>
                          <th scope="col">GST_%</th>
                          <th scope="col">Tax_Amount</th>
                          <th scope="col">Total_Price</th>
                          <th scope="col">Description</th>
                        </tr>
                      </thead>
                      <tbody className="table-group-divider">
                        {currentItems.map((product, index) => (
                          <tr key={index}>
                            <td>{index + 1 + offset}</td>
                            <td>{product.industriesName}</td>
                            {/* <td>{product.productCatogory}</td>
                            <td>{product.subCategory}</td> */}
                            <td>{product.productName}</td>
                            <td>
                              <img src={product.image} width="50" height="50" alt={product.productName} />
                            </td>
                            <td>{product.price}</td>
                            <td>{product.off}</td>
                            <td>{product.gst}</td>
                            <td>{product.amount}</td>
                            <td>{product.totalPrice}</td>
                            <td>{product.discription}</td>
                          </tr>
                        ))}
                      </tbody>
                    </CTable>
                  </div>
                  <ReactPaginate
                    previousLabel= {<CIcon icon={cilChevronLeft} />}
                    nextLabel={<CIcon icon={cilChevronRight} />}
                    breakLabel={'...'}
                    pageClassName={"page-item"}
                    breakClassName={'break-me'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                  />
                </>
              ) : (
                <DataNotPresent title="Data Not present" />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductReports;
