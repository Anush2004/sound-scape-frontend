// import React, { useState, useEffect } from 'react';
// import { ChevronRight, ChevronDown, FileIcon, FolderIcon, X } from 'lucide-react';

// const SidePanel = ({ onFileSelect }) => {
//   const [isVisible, setIsVisible] = useState(true);
//   const [expandedFolders, setExpandedFolders] = useState(new Set());
//   const [fileStructure, setFileStructure] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);

//   // Function to toggle folder expansion
//   const toggleFolder = (path) => {
//     setExpandedFolders(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(path)) {
//         newSet.delete(path);
//       } else {
//         newSet.add(path);
//       }
//       return newSet;
//     });
//   };

//   // Recursive function to render file tree
//   const renderFileTree = (item, depth = 0) => {
//     const paddingLeft = `${depth * 1.25}rem`;

//     if (item.type === 'directory') {
//       const isExpanded = expandedFolders.has(item.path);
//       return (
//         <div key={item.path}>
//           <div 
//             className={`flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer ${
//               isExpanded ? 'bg-gray-750' : ''
//             }`}
//             style={{ paddingLeft }}
//             onClick={() => toggleFolder(item.path)}
//           >
//             {isExpanded ? (
//               <ChevronDown className="w-4 h-4 mr-1" />
//             ) : (
//               <ChevronRight className="w-4 h-4 mr-1" />
//             )}
//             <FolderIcon className="w-4 h-4 mr-2 text-yellow-500" />
//             <span className="text-sm truncate">{item.name}</span>
//           </div>
//           {isExpanded && item.children && (
//             <div>
//               {item.children.map(child => renderFileTree(child, depth + 1))}
//             </div>
//           )}
//         </div>
//       );
//     }

//     // File rendering
//     return (
//       <div
//         key={item.path}
//         className={`flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer ${
//           selectedFile === item.path ? 'bg-gray-600' : ''
//         }`}
//         style={{ paddingLeft: `calc(${paddingLeft} + 1.25rem)` }}
//         onClick={() => setSelectedFile(item.path)}
//         draggable
//         onDragStart={(e) => {
//           e.dataTransfer.setData('application/json', JSON.stringify(item));
//         }}
//       >
//         <FileIcon className={`w-4 h-4 mr-2 ${
//           item.name.endsWith('.mp4') ? 'text-blue-500' : 
//           item.name.endsWith('.mp3') ? 'text-green-500' : 
//           'text-gray-500'
//         }`} />
//         <span className="text-sm truncate">{item.name}</span>
//       </div>
//     );
//   };

//   return (
//     <>
//       {/* Hide/Show Button */}
//       <button
//         onClick={() => setIsVisible(!isVisible)}
//         className={`absolute top-4 ${isVisible ? 'left-52' : 'left-0'} z-10 bg-gray-800 p-2 rounded-r hover:bg-gray-700`}
//       >
//         {isVisible ? <X className="w-4 h-4" /> : <FileIcon className="w-4 h-4" />}
//       </button>

//       {/* Side Panel */}
//       <div 
//         className={`${
//           isVisible ? 'w-64' : 'w-0'
//         } transition-all duration-300 bg-gray-800 border-r border-gray-700 overflow-hidden`}
//       >
//         <div className="p-4 border-b border-gray-700">
//           <h2 className="text-sm font-semibold uppercase">Explorer</h2>
//         </div>

//         {/* File Tree */}
//         <div className="overflow-y-auto" style={{ height: 'calc(100vh - 57px)' }}>
//           {fileStructure ? (
//             renderFileTree(fileStructure)
//           ) : (
//             <div className="p-4 text-sm text-gray-400">
//               Open a folder to start
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default SidePanel;


import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronDown, FileIcon, FolderIcon, X, FolderOpen } from 'lucide-react';

const SidePanel = ({ onFileSelect }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [fileStructure, setFileStructure] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOverFolder, setDragOverFolder] = useState(null);
  const fileInputRef = useRef(null);

  // 📁 Handle folder upload
  const handleFolderUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const root = { type: 'directory', name: 'Uploaded Folder', path: '', children: [] };

    files.forEach(file => {
      const parts = file.webkitRelativePath.split('/');
      let current = root;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // File
          current.children.push({
            type: 'file',
            name: part,
            path: file.webkitRelativePath,
            file, // Store actual File object
          });
        } else {
          // Directory
          let dir = current.children.find(c => c.name === part && c.type === 'directory');
          if (!dir) {
            dir = { type: 'directory', name: part, path: parts.slice(0, index + 1).join('/'), children: [] };
            current.children.push(dir);
          }
          current = dir;
        }
      });
    });

    setFileStructure(root);
    setExpandedFolders(new Set([root.path])); // Expand root
  };

  // 📂 Toggle folder expand/collapse
  const toggleFolder = (path) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      newSet.has(path) ? newSet.delete(path) : newSet.add(path);
      return newSet;
    });
  };

  // 🚀 Handle Drag Start
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  // 📥 Handle Drag Over
  const handleDragOver = (e, folder) => {
    e.preventDefault();
    setDragOverFolder(folder.path);
  };

  // 📥 Handle Drop
  const handleDrop = (e, targetFolder) => {
    e.preventDefault();
    setDragOverFolder(null);

    const draggedItem = JSON.parse(e.dataTransfer.getData('application/json'));
    if (!draggedItem) return;

    if (draggedItem.path === targetFolder.path) return; // Prevent self-drop

    // Copy file/folder into target
    const copyItem = (item) => {
      if (item.type === 'file') {
        return { ...item, path: `${targetFolder.path}/${item.name}` };
      } else if (item.type === 'directory') {
        return {
          ...item,
          path: `${targetFolder.path}/${item.name}`,
          children: item.children.map(copyItem),
        };
      }
    };

    const updatedStructure = { ...fileStructure };

    const addToFolder = (current, folderPath, itemToAdd) => {
      if (current.path === folderPath) {
        current.children.push(itemToAdd);
      } else if (current.children) {
        current.children.forEach(child => {
          if (child.type === 'directory') addToFolder(child, folderPath, itemToAdd);
        });
      }
    };

    addToFolder(updatedStructure, targetFolder.path, copyItem(draggedItem));
    setFileStructure(updatedStructure);
  };

  // 🌳 Recursive render of file tree
  const renderFileTree = (item, depth = 0) => {
    const paddingLeft = `${depth * 1.25}rem`;

    if (item.type === 'directory') {
      const isExpanded = expandedFolders.has(item.path);
      const isDragOver = dragOverFolder === item.path;

      return (
        <div key={item.path}
          onDragOver={(e) => handleDragOver(e, item)}
          onDrop={(e) => handleDrop(e, item)}
          className={`rounded ${isDragOver ? 'bg-blue-600' : ''}`}
        >
          <div 
            className={`flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer ${
              isExpanded ? 'bg-gray-750' : ''
            }`}
            style={{ paddingLeft }}
            onClick={() => toggleFolder(item.path)}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />}
            <FolderIcon className="w-4 h-4 mr-2 text-yellow-500" />
            <span className="text-sm truncate">{item.name}</span>
          </div>
          {isExpanded && item.children && (
            <div>
              {item.children.map(child => renderFileTree(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // 📝 Render file
    return (
      <div
        key={item.path}
        className={`flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer ${
          selectedFile === item.path ? 'bg-gray-600' : ''
        }`}
        style={{ paddingLeft: `calc(${paddingLeft} + 1.25rem)` }}
        onClick={() => {
          setSelectedFile(item.path);
          onFileSelect && onFileSelect(item);
        }}
        draggable
        onDragStart={(e) => handleDragStart(e, item)}
      >
        <FileIcon className={`w-4 h-4 mr-2 ${
          item.name.endsWith('.mp4') ? 'text-blue-500' : 
          item.name.endsWith('.mp3') ? 'text-green-500' : 
          'text-gray-500'
        }`} />
        <span className="text-sm truncate">{item.name}</span>
      </div>
    );
  };

  return (
    <>
      {/* 🔘 Hide/Show Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`absolute top-4 ${isVisible ? 'left-52' : 'left-0'} z-10 bg-gray-800 p-2 rounded-r hover:bg-gray-700`}
      >
        {isVisible ? <X className="w-4 h-4" /> : <FolderIcon className="w-4 h-4" />}
      </button>

      {/* 📁 Side Panel */}
      <div 
        className={`${
          isVisible ? 'w-64' : 'w-0'
        } transition-all duration-300 bg-gray-800 border-r border-gray-700 overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-sm font-semibold uppercase">Explorer</h2>

          {/* 📤 Select Folder Button */}
          <button
            onClick={() => fileInputRef.current.click()}
            className="flex items-center bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600"
          >
            <FolderOpen className="w-4 h-4 mr-1" />
            <span className="text-xs">Select Folder</span>
          </button>

          {/* Hidden file input for folder selection */}
          <input
            type="file"
            ref={fileInputRef}
            webkitdirectory="true"
            directory=""
            multiple
            onChange={handleFolderUpload}
            className="hidden"
          />
        </div>

        {/* 🌳 File Tree */}
        <div className="overflow-y-auto" style={{ height: 'calc(100vh - 57px)' }}>
          {fileStructure ? (
            renderFileTree(fileStructure)
          ) : (
            <div className="p-4 text-sm text-gray-400">
              Click "Select Folder" to upload
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SidePanel;
