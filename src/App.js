import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const tracks = [
    { src: '/music/lofi1.mp3', name: 'Track 1' },
    { src: '/music/lofi2.mp3', name: 'Track 2' },
    { src: '/music/lofi3.mp3', name: 'Track 3' },
    { src: '/music/lofi4.mp3', name: 'Track 4' },
    { src: '/music/lofi5.mp3', name: 'Track 5' },
    { src: '/music/lofi6.mp3', name: 'Track 6' },
    { src: '/music/lofi7.mp3', name: 'Track 7' },
    { src: '/music/lofi8.mp3', name: 'Track 8' },
];

function App() {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [showPlanner, setShowPlanner] = useState(false);
    const [showNoteArea, setShowNoteArea] = useState(false);
    const [showDropArea, setShowDropArea] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [background, setBackground] = useState('/images/background7.gif');
    const [notes, setNotes] = useState('');
    const [dropAreaSize, setDropAreaSize] = useState({ width: '400px', height: '300px' });
    const [isPlaying, setIsPlaying] = useState(false);
    const taskInputRef = useRef();
    const audioPlayerRef = useRef();
    const fileInputRef = useRef();
    const [cookiesAccepted, setCookiesAccepted] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragDirection, setDragDirection] = useState('');
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const dropAreaRef = useRef(null);
    const [showBackgroundPreview, setShowBackgroundPreview] = useState(false);
    const [showDropAreaOpen, setshowDropAreaOpen] = useState(false);
    

    const backgroundDetails = {
        'background1.gif': { 
            name: 'Blue Lagoon', 
            description: 'Serene blue ocean landscape' 
        },
        'background4.gif': { 
            name: 'Cafe', 
            description: 'Cozy coffee shop atmosphere' 
        },
        'background6.gif': { 
            name: 'Beachside Living Room', 
            description: 'Relaxing room with ocean view' 
        },
        'background7.gif': { 
            name: 'Sunset Window', 
            description: 'Warm sunset through a window' 
        },
        'background8.gif': { 
            name: 'Midnight Street', 
            description: 'Calm nighttime urban scene' 
        }
    };

    const acceptCookies = () => {
        setCookiesAccepted(true);
    };

    useEffect(() => {
        const audioElement = audioPlayerRef.current;
        
        const handleTrackEnd = () => {
            nextTrack();
        };

        audioElement.addEventListener('ended', handleTrackEnd);
        
        return () => {
            audioElement.removeEventListener('ended', handleTrackEnd);
        };
    }, [currentTrackIndex]);

    const loadTrack = (index) => {
        const audioElement = audioPlayerRef.current;
        audioElement.src = tracks[index].src;
        audioElement.load();
        if (isPlaying) {
            audioElement.play();
        }
    };

    const nextTrack = () => {
        const newIndex = (currentTrackIndex + 1) % tracks.length;
        setCurrentTrackIndex(newIndex);
        loadTrack(newIndex);
    };

    const previousTrack = () => {
        const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        setCurrentTrackIndex(newIndex);
        loadTrack(newIndex);
    };

    useEffect(() => {
        const audioElement = audioPlayerRef.current;
        audioElement.addEventListener('play', () => setIsPlaying(true));
        audioElement.addEventListener('pause', () => setIsPlaying(false));
        
        return () => {
            audioElement.removeEventListener('play', () => setIsPlaying(true));
            audioElement.removeEventListener('pause', () => setIsPlaying(false));
        };
    }, []);

    const togglePlanner = () => {
        setShowPlanner(!showPlanner);
    };

    useEffect(() => {
        if (showPlanner) {
            taskInputRef.current.focus();
        }
    }, [showPlanner]);

    const toggleBackgroundPreview = () => {
        setShowBackgroundPreview(!showBackgroundPreview);
    };

    const toggleDropArea = () => setShowDropArea(!showDropArea);

    const toggleNoteArea = () => setShowNoteArea(!showNoteArea);

    const [currentBackgroundName, setCurrentBackgroundName] = useState('Sunset Window');
    const changeBackground = (event) => {
        const selectedBackground = event.target.value;
        const newBackground = `/images/${selectedBackground}`;
        setBackground(newBackground);
        setCurrentBackgroundName(backgroundDetails[selectedBackground].name);
    };

    const handleDropAreaResize = (dimension, value) => {
        setDropAreaSize(prev => ({
            ...prev,
            [dimension]: value
        }));
    };

    const addTask = () => {
        const taskText = taskInputRef.current.value.trim();
        if (taskText !== '') {
            setTasks([...tasks, { text: taskText, completed: false }]);
            taskInputRef.current.value = '';
        }
    };

    const toggleTaskCompletion = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].completed = !updatedTasks[index].completed;
        setTasks(updatedTasks);
    };

    const removeTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    };

    const downloadTasks = () => {
        const taskData = tasks.map(task => task.text).join('\n');
        const fileName = prompt('Enter a file name for the tasks:', 'tasks.txt');
        if (fileName) {
            const blob = new Blob([taskData], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const exportNotes = () => {
        const fileName = prompt('Enter a file name for the notes:', 'notes.txt');
        if (fileName) {
            const blob = new Blob([notes], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const loadNotesFromFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setNotes(e.target.result);
            };
            reader.readAsText(file);
        }
    };
      const [preloadedDocuments, setPreloadedDocuments] = useState([]);
      const [showPreloadedDocuments, setShowPreloadedDocuments] = useState(false);

      const togglePreloadedDocuments = () => {
          setShowPreloadedDocuments(!showPreloadedDocuments);
      };

      const addPreloadedDocument = (file) => {
          setPreloadedDocuments([...preloadedDocuments, file]);
      };

      const removePreloadedDocument = (index) => {
          setPreloadedDocuments(documents => documents.filter((_, i) => i !== index));
      };

      const handleFileDrop = (event) => {
          event.preventDefault();
          const files = event.dataTransfer.files;
          if (files.length > 0) {
              handleFile(files[0]);
              addPreloadedDocument(files[0]);
          }
      };

      const handleMouseDown = (e, direction) => {
          e.preventDefault();
        setIsDragging(true);
        setDragDirection(direction);
        setStartPosition({
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !dropAreaRef.current) return;

        const deltaX = e.clientX - startPosition.x;
        const deltaY = e.clientY - startPosition.y;
        const currentWidth = parseInt(dropAreaSize.width);
        const currentHeight = parseInt(dropAreaSize.height);

        switch (dragDirection) {
            case 'e':
                setDropAreaSize(prev => ({
                    ...prev,
                    width: `${currentWidth + deltaX}px`
                }));
                break;
            case 's':
                setDropAreaSize(prev => ({
                    ...prev,
                    height: `${currentHeight + deltaY}px`
                }));
                break;
            case 'se':
                setDropAreaSize({
                    width: `${currentWidth + deltaX}px`,
                    height: `${currentHeight + deltaY}px`
                });
                break;
            default:
                break;
        }

        setStartPosition({
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDragDirection('');
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);
      const handleFile = (file) => {
          const fileType = file.type;
          const fileURL = URL.createObjectURL(file);
          const dropArea = document.getElementById('drop-area-content');
          dropArea.innerHTML = ''; // Clear previous content

          if (fileType === 'application/pdf') {
              const container = document.createElement('div');
              container.style.width = '100%';
              container.style.height = '100%';
              container.style.position = 'relative';
              container.style.overflow = 'hidden';

              const iframe = document.createElement('iframe');
              iframe.src = fileURL;
              iframe.style.width = '100%';
              iframe.style.height = '100%';
              iframe.style.border = 'none';
              iframe.style.position = 'absolute';
              iframe.style.top = '0';
              iframe.style.left = '0';
              iframe.allowFullscreen = true;

              container.appendChild(iframe);
              dropArea.appendChild(container);
          } else if (fileType.startsWith('image/')) {
              const img = new Image();
              img.src = fileURL;
              img.style.width = '100%';
              img.style.height = 'auto';
              img.onload = () => {
                  dropArea.appendChild(img);
                  dropArea.scrollIntoView({ behavior: 'smooth' });
              };
          } else if (fileType.startsWith('video/')) {
              const videoElement = document.createElement('video');
              videoElement.src = fileURL;
              videoElement.controls = true;
              videoElement.style.width = '100%';
              videoElement.oncanplaythrough = () => {
                  dropArea.appendChild(videoElement);
                  dropArea.scrollIntoView({ behavior: 'smooth' });
              };
          } else {
              dropArea.innerHTML = `Unsupported file type: <strong>${file.name}</strong>`;
              dropArea.scrollIntoView({ behavior: 'smooth' });
          }
      };
    

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };
    const openSpotifyPopup = () => {
        const width = 700; // Adjust width for side popup
        const height = 500; // Adjust height
        const left = window.screen.width - width - 15; // Position it to the right side
        const top = 250; // Position it near the top
    
        window.open(
          "https://open.spotify.com",
          "SpotifyPopup",
          `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );
      };
    

        return (
        <div style={{ backgroundImage: `url(${background})` }} className="App">
            <div id="topRightText"><img src="logo.png" alt="Logo" height="100" width="300" /></div>

            <div id="musicPlayer">

                <button onClick={previousTrack} title="Previous Track">◀</button>
                <div className="track-info">
                    <span>Now Playing: {tracks[currentTrackIndex].name}</span>
                </div>
                <audio ref={audioPlayerRef} controls>
                    <source src={tracks[currentTrackIndex].src} type="audio/mp3" />
                    Your browser does not support the audio element.
                </audio>

                <button onClick={nextTrack} title="Next Track">▶</button>
                <button onClick={togglePlanner} title="Planner">📅</button>
                <button onClick={toggleDropArea} title="File viewer">📂</button>
                <button onClick={toggleNoteArea} title="Notes">📝</button>
                <button onClick={togglePreloadedDocuments} title="Preloaded Documents">🗃️</button>
                <button onClick={toggleBackgroundPreview} title="BackgroundSelector">🖼️</button>
                <button onClick={openSpotifyPopup} title= "Open Spotify" >🎵</button>
                <button onClick={toggleFullscreen} title="Fullscreen">⛶</button>
            </div>
            
            {!cookiesAccepted && (
                <div className="cookie-popup">
                    <div className="cookie-popup-content">
                        <img src='cookie.png' height="80" width="80"></img>
                        <p>We use cookies to enhance your experience.</p>
                        <p>By continuing to visit this site, you agree to our use of cookies.</p>
                        <button onClick={acceptCookies}>Accept</button>
                    </div>
                </div>
            )}
            {showBackgroundPreview && (
    <div className="background-preview-modal">
        <div className="background-preview-content">
            <h2>Select Background</h2>
            <div className="background-preview-grid">
                {[
                    { file: 'background1.gif', name: 'Blue Lagoon' },
                    { file: 'background4.gif', name: 'Cafe' },
                    { file: 'background6.gif', name: 'Beachside Living Room' },
                    { file: 'background7.gif', name: 'Sunset Window' },
                    { file: 'background8.gif', name: 'Midnight Street' }
                ].map((bg) => (
                    <div 
                        key={bg.file} 
                        onClick={() => {
                            setBackground(`/images/${bg.file}`);
                            setCurrentBackgroundName(bg.name);
                            setShowBackgroundPreview(false);
                        }}
                    >
                        <img 
                            src={`/images/${bg.file}`} 
                            alt={bg.name} 
                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        />
                        <p>{bg.name}</p>
                    </div>
                ))}
            </div>
            <button onClick={toggleBackgroundPreview}>Close</button>
        </div>
    </div>
)}




            {showNoteArea && (
                <div id="noteArea">
                    <textarea
                        id="noteTextArea"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Write your notes here..."
                    ></textarea>
                    <div className="note-controls">
                        <button onClick={exportNotes}>Save Notes</button>
                        <input
                            type="file"
                            accept=".txt"
                            onChange={loadNotesFromFile}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                        />
                        <button onClick={() => fileInputRef.current.click()}>
                            Load Notes
                        </button>
                    </div>
                </div>
            )}
             
            {showPlanner && (
                <div id="planner">
                <h2>My Planner</h2>
                <input
                    type="text"
                    ref={taskInputRef}
                    placeholder="Enter a new task..."
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            addTask()
                            }
                        }}
                    />
                    <button onClick={addTask}>Add Task</button>
                     <button onClick={downloadTasks}>Save Tasks</button>
                    <div id="tasks">
                    {tasks.map((task, index) => (
                        <div key={index} className={`task ${task.completed ? 'completed' : ''}`}>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTaskCompletion(index)}
                            />
                            <span>{task.text}</span>
                            <button onClick={() => removeTask(index)}>Remove</button>
                        </div>
                    ))}
                    </div>
                </div>
            )}
            {showPreloadedDocuments && (
                <div id="preloaded-documents">
                    {preloadedDocuments.length > 0 ? (
                        preloadedDocuments.map((document, index) => (
                            <div key={index} className="preloaded-document">
                            <span 
                                onClick={() => {
                                        if (!showDropArea) {
                                            setShowDropArea(true); // Open drop area if it's closed
                                            setTimeout(() => handleFile(document), 100); // Wait for UI update
                                        } else {
                                            handleFile(document); // Directly load the file if drop area is already open
                                         }
                                    }}
                                    style={{ cursor: 'pointer' }}
                                        >
                                    {document.name}
                            </span>
                                <button 
                                    onClick={() => removePreloadedDocument(index)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="preloaded-document">
                            <span>No files loaded</span>
                        </div>
                    )}
                </div>
            )}
            {showDropArea && (
                <div id="drop-area-container">
                    <div
                        ref={dropAreaRef}
                        id="drop-area"
                        style={{
                            width: dropAreaSize.width,
                            height: dropAreaSize.height,
                            position: 'relative',
                            border: '2px dashed #ccc',
                            borderRadius: '8px',
                            padding: '20px',
                            textAlign: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.15);'
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                    >
                        <div id="drop-area-content" style={{ 
                            width: '100%', 
                            height: '100%', 
                            overflow: 'hidden',
                            transformOrigin: 'center center'
                            
                        }}>
                            Drag & Drop any file here
                        </div>
                        
                        {/* Resize handles */}
                        <div
                            className="resize-handle resize-e"
                            onMouseDown={(e) => handleMouseDown(e, 'e')}
                        />
                        <div
                            className="resize-handle resize-s"
                            onMouseDown={(e) => handleMouseDown(e, 's')}
                        />
                        <div
                            className="resize-handle resize-se"
                            onMouseDown={(e) => handleMouseDown(e, 'se')}
                        />
                    </div>
                    
                    {/* Transparent Browse Files Button */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        onChange={(e) => {
                            if (e.target.files.length > 0) {
                                handleFile(e.target.files[0]);
                                addPreloadedDocument(e.target.files[0]);
                            }
                        }}
                    />
                    <button 
                        onClick={() => fileInputRef.current.click()}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slightly transparent white
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '20%', // This makes it a perfect circle
                            width: '40px', // Fixed width
                            height: '40px', // Same as width to ensure a circle
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            marginTop: '10px',
                            outline: 'none', // Removes default focus outline
                            transition: 'background-color 0.3s ease' // Optional: smooth hover effect
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                    >
                      📁
                    </button>                </div>
            )}
        </div>
    );
};

export default App;