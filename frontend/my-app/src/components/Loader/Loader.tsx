import React from 'react'

const Loader = () => {
    return (
        <div className="flex items-center space-x-2">
            <div className="animate-pulse rounded-full bg-gray-500 h-12 w-12"></div>
            <div className="space-y-2">
                <div className="animate-pulse rounded-md bg-gray-500 h-4 w-50"> </div>
                <div className="animate-pulse rounded-md bg-gray-500 h-4 w-42.5"> </div>
            </div>
        </div>
    
  )
}

export default Loader
