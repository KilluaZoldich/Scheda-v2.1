"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      // Check if window is available (client-side)
      if (typeof window !== "undefined") {
        // Multiple detection methods for better accuracy
        const userAgent = navigator.userAgent.toLowerCase()
        const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
        const isSmallScreen = window.innerWidth <= 768
        const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0

        // Consider it mobile if any of these conditions are true
        setIsMobile(isMobileUserAgent || (isSmallScreen && isTouchDevice) || isSmallScreen)
      }
    }

    // Initial check
    checkDevice()

    // Listen for resize events with debouncing
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkDevice, 100)
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  return isMobile
}
