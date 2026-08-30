// components/store/PDFFlipbook.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Loader2, FileText, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

interface ProspectData {
  pdf?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  previewImage?: string;
  isActive?: boolean;
}

interface PDFFlipbookProps {
  prospect?: ProspectData;
  storeName?: string;
  className?: string;
  height?: string | number;
}

declare global {
  interface Window {
    PDFlipbook: any;
  }
}

export default function PDFFlipbook({
  prospect,
  storeName = 'Prospekt',
  className = '',
  height = '600px',
}: PDFFlipbookProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookContainerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<any>(null);
  const isMountedRef = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  // Get the PDF URL from prospect
  const pdfUrl = prospect?.pdf;

  // Debug: Log the prospect data (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📄 PDFFlipbook received prospect:', prospect);
      console.log('📄 PDF URL:', pdfUrl);
    }
  }, [prospect, pdfUrl]);

  // Force remount when PDF URL changes
  useEffect(() => {
    if (pdfUrl) {
      setKey(prev => prev + 1);
    }
  }, [pdfUrl]);

  // Load PDFlipbook script
  useEffect(() => {
    isMountedRef.current = true;
    
    if (!pdfUrl) {
      if (process.env.NODE_ENV === 'development') {
        console.log('⏭️ No PDF URL provided');
      }
      setIsLoading(false);
      return;
    }

    let isDestroyed = false;
    let scriptElement: HTMLScriptElement | null = null;

    const loadPDFlipbook = async () => {
      try {
        // Check if component is still mounted
        if (!isMountedRef.current || isDestroyed) return;
        
        setIsLoading(true);
        setError(null);

        // Check if already loaded
        if (!window.PDFlipbook) {
          await new Promise((resolve, reject) => {
            scriptElement = document.createElement('script');
            scriptElement.src = 'https://cdn.jsdelivr.net/gh/SympleNZ/PDFlipbook/pdflipbook.js';
            scriptElement.async = true;
            scriptElement.onload = resolve;
            scriptElement.onerror = reject;
            document.head.appendChild(scriptElement);
          });
        }

        // Wait for next tick
        await new Promise(resolve => setTimeout(resolve, 300));

        // Check if component is still mounted
        if (!isMountedRef.current || isDestroyed || !bookContainerRef.current) return;

        // Clean up existing book
        if (bookRef.current) {
          try {
            bookRef.current.destroy();
          } catch (e) {
            // Ignore destroy errors
          }
          bookRef.current = null;
        }

        // Clear the book container completely
        const bookContainer = bookContainerRef.current;
        
        // Remove all child nodes safely
        while (bookContainer.firstChild) {
          try {
            bookContainer.removeChild(bookContainer.firstChild);
          } catch (e) {
            // If we can't remove a child, create a new container
            break;
          }
        }

        // If we couldn't clear the container properly, recreate it
        if (bookContainer.firstChild) {
          const newContainer = document.createElement('div');
          newContainer.style.width = '100%';
          newContainer.style.height = '100%';
          newContainer.style.position = 'relative';
          bookContainer.innerHTML = '';
          bookContainer.appendChild(newContainer);
          
          // Create the flipbook in the new container
          const book = window.PDFlipbook.create(newContainer, {
            url: pdfUrl,
            startPage: 1,
            duration: 520,
            edgeSize: 0.14,
            cornerFold: true,
            displayMode: 'auto',
            controls: true,
            zoomSteps: [1, 1.5, 2, 3],
            shadow: 'normal',
            arrows: true,
            pageNumbers: true,
            maxScale: 2,
            padding: 16,
          });

          bookRef.current = book;
          
          // Set up event listeners on the new container
          setupEventListeners(newContainer);
        } else {
          // Create the flipbook in the empty container
          const book = window.PDFlipbook.create(bookContainer, {
            url: pdfUrl,
            startPage: 1,
            duration: 520,
            edgeSize: 0.14,
            cornerFold: true,
            displayMode: 'auto',
            controls: true,
            zoomSteps: [1, 1.5, 2, 3],
            shadow: 'normal',
            arrows: true,
            pageNumbers: true,
            maxScale: 2,
            padding: 16,
          });

          bookRef.current = book;
          
          // Set up event listeners
          setupEventListeners(bookContainer);
        }
      } catch (err) {
        if (isMountedRef.current && !isDestroyed) {
          console.error('Failed to load PDFlipbook:', err);
          setError(err instanceof Error ? err.message : 'Failed to load flipbook');
          setIsLoading(false);
        }
      }
    };

    const setupEventListeners = (element: HTMLElement) => {
      const handleReady = (e: any) => {
        if (isMountedRef.current && !isDestroyed) {
          setTotalPages(e.detail.pages);
          setIsLoading(false);
        }
      };

      const handlePageChange = (e: any) => {
        if (isMountedRef.current && !isDestroyed) {
          setCurrentPage(e.detail.page);
        }
      };

      const handleError = (e: any) => {
        if (isMountedRef.current && !isDestroyed) {
          setError(e.detail.error?.message || 'Failed to load PDF');
          setIsLoading(false);
        }
      };

      // Store event listeners for cleanup
      element.addEventListener('flipbook:ready', handleReady);
      element.addEventListener('flipbook:pagechange', handlePageChange);
      element.addEventListener('flipbook:error', handleError);

      // Store cleanup function
      return () => {
        element.removeEventListener('flipbook:ready', handleReady);
        element.removeEventListener('flipbook:pagechange', handlePageChange);
        element.removeEventListener('flipbook:error', handleError);
      };
    };

    loadPDFlipbook();

    // Cleanup function
    return () => {
      isDestroyed = true;
      isMountedRef.current = false;

      // Remove script element
      if (scriptElement && scriptElement.parentNode) {
        try {
          scriptElement.parentNode.removeChild(scriptElement);
        } catch (e) {
          // Ignore
        }
      }

      // Destroy the book instance
      if (bookRef.current) {
        try {
          const book = bookRef.current;
          bookRef.current = null;
          if (book && typeof book.destroy === 'function') {
            book.destroy();
          }
        } catch (e) {
          // Ignore destroy errors
        }
      }

      // Clear the container
      if (bookContainerRef.current) {
        try {
          // Clear innerHTML to avoid React reconciliation issues
          bookContainerRef.current.innerHTML = '';
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [pdfUrl, key]);

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Manual navigation controls
  const goToPreviousPage = () => {
    if (bookRef.current) {
      try {
        bookRef.current.prev();
      } catch (e) {
        console.warn('Error navigating to previous page:', e);
      }
    }
  };

  const goToNextPage = () => {
    if (bookRef.current) {
      try {
        bookRef.current.next();
      } catch (e) {
        console.warn('Error navigating to next page:', e);
      }
    }
  };

  // Format date range
  const formatDateRange = () => {
    const start = prospect?.startDate;
    const end = prospect?.endDate;
    
    if (!start && !end) return '';
    
    try {
      const startDate = start ? new Date(start) : null;
      const endDate = end ? new Date(end) : null;
      
      let result = '';
      if (startDate && !isNaN(startDate.getTime())) {
        result += startDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
      }
      if (endDate && !isNaN(endDate.getTime())) {
        result += (result ? ' - ' : '') + endDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
      }
      return result;
    } catch {
      return '';
    }
  };

  // If no PDF URL, show fallback
  if (!pdfUrl) {
    return (
      <div 
        className={`bg-gray-100 rounded-xl flex flex-col items-center justify-center p-8 ${className}`}
        style={{ height }}
      >
        <FileText className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 text-center">Kein Prospekt verfügbar</p>
        {prospect?.previewImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={prospect.previewImage}
            alt="Prospekt"
            className="mt-4 max-h-40 object-contain rounded-lg"
          />
        )}
      </div>
    );
  }

  const title = prospect?.title || storeName;
  const dateRange = formatDateRange();

  return (
    <div className={`relative ${className}`} key={key}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          {dateRange && (
            <p className="text-xs text-gray-500">{dateRange}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousPage}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            disabled={isLoading || currentPage <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-xs text-gray-600 min-w-[60px] text-center">
            {isLoading ? '...' : `${currentPage} / ${totalPages}`}
          </span>
          <button
            onClick={goToNextPage}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            disabled={isLoading || currentPage >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-gray-600" />
            ) : (
              <Maximize2 className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Flipbook Container - Use a wrapper to isolate DOM changes */}
      <div
        ref={containerRef}
        style={{ height }}
        className="relative bg-gray-50 rounded-xl overflow-hidden border border-gray-200"
      >
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10">
            <Loader2 className="w-12 h-12 text-rose-500 animate-spin mb-4" />
            <p className="text-sm text-gray-500">Lade Prospekt...</p>
          </div>
        )}
        
        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10 p-4">
            <div className="text-red-500 text-lg font-semibold mb-2">⚠️</div>
            <p className="text-sm text-gray-600 text-center">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 text-sm bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            >
              Neu laden
            </button>
          </div>
        )}

        {/* Book container - isolated from React reconciliation */}
        <div 
          ref={bookContainerRef} 
          className="w-full h-full relative"
          style={{ 
            opacity: isLoading || error ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />
      </div>
    </div>
  );
}