import React, { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  IconButton,
  CircularProgress,
  Box,
  List,
  ListItem,
  Card,
  CardContent,
  SelectChangeEvent,
} from "@mui/material";
import { Close, CloudUpload, FileCopy, PictureAsPdf, Description } from "@mui/icons-material";
import { InsertChart, InsertPhoto } from "@mui/icons-material"; // For Excel, PowerPoint, etc.
import axios from "axios";
import API_BASE_URL from "../../config";

interface UploadPopupProps {
  onClose: () => void;
  onUploadConfirm: (files: File[], category: string) => void;
  initialSelectedFiles: File[];
}

const UploadPopup: React.FC<UploadPopupProps> = ({ onClose, onUploadConfirm, initialSelectedFiles }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>(initialSelectedFiles);
  const [category, setCategory] = useState<string>("default");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [documentGroups, setDocumentGroups] = useState<string[]>([]);

  useEffect(() => {
    const fetchDocumentGroups = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/list_document_groups`);
        setDocumentGroups(response.data.document_groups);
      } catch (error) {
        console.error("Error fetching document groups:", error);
      }
    };

    fetchDocumentGroups();
  }, []);

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setSelectedFiles(files);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategory(event.target.value);
  };

  const uploadFiles = async (files: File[], category: string) => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("file", file);
    });

    formData.append("document_group_name", category);

    try {
      setUploading(true);
      setErrorMessage(null);

      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload success:", response.data);

      onUploadConfirm(files, category);
    } catch (error) {
      console.error("Error uploading files:", error);
      setErrorMessage("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedFiles.length > 0 && category !== "default") {
      uploadFiles(selectedFiles, category);
    } else {
      alert("Please select a file and a category.");
    }
  };

  // Utility function to get icon based on file type
  const getFileIcon = (fileName: string) => {
    const fileExtension = fileName.split(".").pop()?.toLowerCase();

    switch (fileExtension) {
      case "pdf":
        return <PictureAsPdf sx={{ color: "#D32F2F", mr: 1 }} />;
      case "doc":
      case "docx":
        return <Description sx={{ color: "#2196F3", mr: 1 }} />;
      case "xls":
      case "xlsx":
        return <InsertChart sx={{ color: "#4CAF50", mr: 1 }} />;
      case "ppt":
      case "pptx":
        return <InsertPhoto sx={{ color: "#FF9800", mr: 1 }} />;
      default:
        return <FileCopy sx={{ color: "#757575", mr: 1 }} />;
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      PaperProps={{
        sx: {
          borderRadius: "12px",
        },
      }}
    >
      <Card sx={{ boxShadow: 8, p: 2 }}>
        <DialogTitle>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h5' fontWeight='bold'>
              파일 업로드
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <CardContent>
            <Box display='flex' flexDirection='column' gap={3}>
              {/* Document Category Selection */}
              <FormControl fullWidth variant='outlined'>
                <InputLabel id='category-label'>문서 그룹 선택</InputLabel>
                <Select
                  labelId='category-label'
                  value={category}
                  onChange={handleCategoryChange}
                  label='문서 그룹 선택'
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "lightgray",
                      },
                      "&:hover fieldset": {
                        borderColor: "#3f51b5",
                      },
                    },
                  }}
                >
                  <MenuItem value='default'>문서 그룹</MenuItem>
                  {documentGroups.map((group, index) => (
                    <MenuItem key={index} value={group}>
                      {group}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* File Upload Section */}
              <Box
                sx={{
                  border: "2px dashed #ddd",
                  borderRadius: 2,
                  p: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudUpload sx={{ mr: 1, fontSize: 40, color: "#3f51b5" }} />
                <Typography>
                  {selectedFiles.length > 0
                    ? `${selectedFiles.length} 파일 선택됨`
                    : "클릭하여 파일을 선택하거나 끌어다 놓으세요"}
                </Typography>
                <input type='file' ref={fileInputRef} onChange={handleFileSelection} multiple hidden />
              </Box>

              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <List
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    maxHeight: "150px",
                    overflow: "auto",
                    p: 1,
                  }}
                >
                  {selectedFiles.map((file, index) => (
                    <ListItem key={index} sx={{ display: "flex", alignItems: "center" }}>
                      {getFileIcon(file.name)}
                      <Typography>{file.name}</Typography>
                    </ListItem>
                  ))}
                </List>
              )}

              {/* Loading Spinner */}
              {uploading && (
                <Box display='flex' alignItems='center' gap={1}>
                  <CircularProgress size={24} />
                  <Typography>업로드 중...</Typography>
                </Box>
              )}
              {errorMessage && (
                <Typography color='error' variant='body2'>
                  {errorMessage}
                </Typography>
              )}

              {/* Action Buttons */}
              <Box display='flex' justifyContent='space-evenly' gap={2} mt={2}>
                <Button
                  variant='contained'
                  color='primary'
                  size='medium'
                  sx={{ borderRadius: 2, width: 150, height: 45 }}
                  onClick={handleConfirm}
                  disabled={uploading || selectedFiles.length === 0 || category === "default"}
                >
                  {uploading ? "업로드 중..." : "업로드"}
                </Button>
                <Button
                  variant='contained'
                  color='error'
                  size='medium'
                  sx={{ borderRadius: 2, width: 150, height: 45 }}
                  onClick={onClose}
                  disabled={uploading}
                >
                  취소
                </Button>
              </Box>
            </Box>
          </CardContent>
        </DialogContent>
      </Card>
    </Dialog>
  );
};

export default UploadPopup;
