import React, { useState, useEffect } from "react";
import "./FileManager.css";

import { ReactComponent as PDFIcon } from "../../assets/Profile/PDFIcon.svg";
import UploadPopup from "../UploadPopup/UploadPopup";
import { ReactComponent as UploadIcon } from "../../assets/Profile/Upload.svg";
import API_BASE_URL from "../../config";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import TableChartIcon from "@mui/icons-material/TableChart";
import SearchIcon from "../../assets/Profile/SearchIcon.tsx";

interface FileUpload {
  name: string;
  documentGroup: string;
  uploadDate: Date;
  status: string;
  fileType: string;
}

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("latest");
  const [typeOrder, setTypeOrder] = useState<string>("all");
  const [statusOrder, setStatusOrder] = useState<string>("all");
  const [view, setView] = useState<"list" | "grid">("list");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const parseTimestamp = (timestamp: string) => {
    const year = parseInt(timestamp.slice(0, 4), 10);
    const month = parseInt(timestamp.slice(4, 6), 10) - 1; // JS months are 0-based
    const day = parseInt(timestamp.slice(6, 8), 10);
    const hour = parseInt(timestamp.slice(9, 11), 10);
    const minute = parseInt(timestamp.slice(11, 13), 10);
    const second = parseInt(timestamp.slice(13, 15), 10);

    return new Date(year, month, day, hour, minute, second);
  };

  // Fetch files from API on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/list_recent_file_uploads`);
        const fetchedFiles = response.data.documents.map((doc: any) => ({
          name: doc.original_name,
          documentGroup: doc.document_group_name,
          uploadDate: parseTimestamp(doc.timestamp),
          status: doc.status,
          fileType: doc.file_type, // Assuming API provides this
        }));
        setFiles(fetchedFiles);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    setAnchorEl(event.currentTarget);
    setActiveDropdownIndex(index);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setActiveDropdownIndex(null);
  };

  const handleCopyLink = (fileName: string) => {
    const link = `${API_BASE_URL}/files/${fileName}`;
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
    });
    handlePopoverClose();
  };

  const handleDeleteFile = (fileName: string) => {
    alert(`Deleting file: ${fileName}`);
    handlePopoverClose();
  };

  // Function to handle type order change
  const handleTypeChange = (e: any) => {
    setTypeOrder(e.target.value);
  };

  // Function to handle status order change
  const handleStatusChange = (e: any) => {
    setStatusOrder(e.target.value);
  };

  // Function to handle sort order change
  const handleSortChange = (e: any) => {
    setSortOrder(e.target.value);
  };

  // Function to sort and filter files based on type, status, and sort order
  const filteredFiles = () => {
    return [...files]
      .filter((file) => {
        // Filter based on selected type
        if (typeOrder === "all") return true;
        if (typeOrder === "pdf") return file.fileType === "pdf";
        if (typeOrder === "doc") return ["doc", "docx"].includes(file.fileType);
        if (typeOrder === "xls") return ["xls", "xlsx"].includes(file.fileType);
        if (typeOrder === "ppt") return ["ppt", "pptx"].includes(file.fileType);
        return true;
      })
      .filter((file) => {
        // Filter based on selected status
        if (statusOrder === "all") return true; // Show all files if 'all' is selected
        return file.status === statusOrder;
      })
      .sort((a, b) => {
        switch (sortOrder) {
          case "latest":
            return b.uploadDate.getTime() - a.uploadDate.getTime();
          case "earliest":
            return a.uploadDate.getTime() - b.uploadDate.getTime();
          case "az":
            return a.name.localeCompare(b.name);
          case "za":
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
  };

  // Function to handle view change (list or grid)
  // const handleViewChange = (viewType: "list" | "grid") => {
  //   setView(viewType);
  // };

  // Function to get the appropriate icon based on file type
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <PictureAsPdfIcon sx={{ color: "red" }} />;
      case "doc":
      case "docx":
        return <DescriptionIcon sx={{ color: "blue" }} />;
      case "ppt":
      case "pptx":
        return <SlideshowIcon sx={{ color: "orange" }} />;
      case "xls":
      case "xlsx":
        return <TableChartIcon sx={{ color: "green" }} />;
      default:
        return <InsertDriveFileIcon />;
    }
  };

  // Function to handle upload button click
  const handleUploadClick = () => {
    setShowPopup(true); // Show the upload popup when the button is clicked
  };

  // Function to close the popup
  const handleClosePopup = () => {
    setSelectedFiles([]);
    setShowPopup(false);
  };

  // Function to handle the upload confirmation
  const handleConfirmUpload = (files: File[], category: string) => {
    console.log("Files:", files, "Category:", category);
    setShowPopup(false);
    // Add logic to upload files to the server or update the file list in the FileManager
  };

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedFiles = filteredFiles().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <div className='file-manager-container'>
        <div>
          <Box sx={{ marginBottom: 5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className='section-title'>최근 업로드</div>
            <Button
              variant='contained'
              startIcon={<UploadIcon />}
              onClick={handleUploadClick}
              sx={{
                width: 120,
                height: 40,
                backgroundColor: "#251659;",
                color: "#FFFFFF",
                borderRadius: "8px",
                textTransform: "none",
                padding: "8px 16px",
                "&:hover": {
                  backgroundColor: "#2D0273",
                },
              }}
            >
              업로드
            </Button>
          </Box>

          {/* Conditionally render the upload popup */}
          {showPopup && (
            <UploadPopup
              onClose={handleClosePopup}
              onUploadConfirm={handleConfirmUpload}
              initialSelectedFiles={selectedFiles}
            />
          )}
        </div>
        <div className='file-manager-header'>
          {/* Search Input */}
          <TextField
            placeholder='Search...'
            variant='outlined'
            size='small'
            sx={{
              width: 250,
              background: "#f8f8f8",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "black",
                },
                "&:hover fieldset": {
                  borderColor: "black",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <div className='header-buttons-container'>
            {/* Document Type Filter */}
            <FormControl>
              <InputLabel id='type-label'>문서 유형</InputLabel>
              <Select
                labelId='type-label'
                value={typeOrder}
                onChange={handleTypeChange}
                displayEmpty
                variant='outlined'
                label='문서 유형'
                sx={{
                  width: 150,
                  height: 40,
                }}
              >
                <MenuItem value='all'>천제</MenuItem>
                <MenuItem value='pdf'>Pdf</MenuItem>
                <MenuItem value='doc'>Word</MenuItem>
                <MenuItem value='ppt'>Ppt</MenuItem>
                <MenuItem value='xls'>Excel</MenuItem>
              </Select>
            </FormControl>

            {/* Status Filter */}
            <FormControl>
              <InputLabel id='status-label'>상태</InputLabel>
              <Select
                labelId='status-label'
                value={statusOrder}
                onChange={handleStatusChange}
                displayEmpty
                variant='outlined'
                label='상태'
                sx={{
                  width: 150,
                  height: 40,
                }}
              >
                <MenuItem value='all'>천제</MenuItem>
                <MenuItem value='완료'>완료</MenuItem>
                <MenuItem value='업로드 중'>업로드 중</MenuItem>
                <MenuItem value='실패'>실패</MenuItem>
              </Select>
            </FormControl>

            {/* Sorting Filter */}
            <FormControl>
              <InputLabel id='category-label'>정열 기준</InputLabel>
              <Select
                labelId='category-label'
                value={sortOrder}
                onChange={handleSortChange}
                displayEmpty
                variant='outlined'
                label='정열 기준'
                sx={{
                  width: 150,
                  height: 40,
                }}
              >
                <MenuItem value='latest'>Latest Uploaded</MenuItem>
                <MenuItem value='earliest'>Earliest Uploaded</MenuItem>
                <MenuItem value='az'>Alphabetical A-Z</MenuItem>
                <MenuItem value='za'>Alphabetical Z-A</MenuItem>
              </Select>
            </FormControl>

            {/* View Toggle Buttons */}
            {/* <div className='view-buttons'>
              <button onClick={() => handleViewChange("list")}>
                <ListIcon />
              </button>
              <button onClick={() => handleViewChange("grid")}>
                <GridIcon />
              </button>
            </div> */}
          </div>
        </div>

        <div style={{ width: "100%" }}>
          {view === "list" && (
            <TableContainer sx={{ borderRadius: "10px" }}>
              <Table size='small'>
                <TableHead sx={{ height: "50px", background: "#cedfe2" }}>
                  <TableRow>
                    <TableCell>이름</TableCell>
                    <TableCell>문서 그룹</TableCell>
                    <TableCell>문서 용량</TableCell>
                    <TableCell>문서 유형</TableCell>
                    <TableCell>문서 상태</TableCell>
                    <TableCell>업로드 날짜</TableCell>
                    <TableCell>
                      <MoreHorizIcon />
                    </TableCell>
                  </TableRow>
                </TableHead>

                {/* Body */}
                <TableBody>
                  {displayedFiles.length > 0 ? (
                    displayedFiles.map((file, index) => (
                      <TableRow key={index} sx={{ background: "white", marginTop: "10px" }}>
                        <TableCell>
                          <div className='file-info' style={{ display: "flex", alignItems: "center" }}>
                            <div className='file-iconn'>
                              <PDFIcon />
                            </div>
                            {file.name}
                          </div>
                        </TableCell>
                        {/* <TableCell>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {getFileIcon(file.fileType)}
                            {file.name}
                          </div>
                        </TableCell> */}
                        <TableCell> {file.documentGroup}</TableCell>
                        <TableCell>2.98Mb</TableCell>
                        <TableCell>{file.fileType ?? "pdf"}</TableCell>
                        <TableCell>{file.status}</TableCell>
                        <TableCell>{file.uploadDate.toLocaleDateString()}</TableCell>
                        <TableCell sx={{ padding: "6px 25px" }}>
                          <div className='more-options' onClick={(e) => handleMenuOpen(e, index)}>
                            <MoreHorizIcon />
                          </div>
                          {/* Popup Menu */}
                          {activeDropdownIndex === index && (
                            <Popover
                              open={Boolean(anchorEl)}
                              anchorEl={anchorEl}
                              onClose={handlePopoverClose}
                              anchorOrigin={{
                                vertical: "center",
                                horizontal: "left",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                              }}
                              PaperProps={{
                                style: {
                                  borderRadius: 8,
                                  boxShadow:
                                    "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
                                  padding: "8px 0",
                                },
                              }}
                            >
                              <MenuItem onClick={() => handleCopyLink(file.name)} sx={{ gap: 1 }}>
                                <ContentCopyIcon fontSize='small' />
                                Copy Link
                              </MenuItem>

                              <MenuItem onClick={() => handleDeleteFile(file.name)} sx={{ gap: 1, color: "red" }}>
                                <DeleteIcon fontSize='small' sx={{ color: "red" }} />
                                Delete
                              </MenuItem>
                            </Popover>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ alignItems: "center" }} className='no-data-message'>
                        데이터가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {/* Pagination */}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component='div'
                count={filteredFiles().length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          )}
        </div>
      </div>
    </>
  );
};

export default FileManager;
