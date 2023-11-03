import React, { useState, useEffect } from 'react';


const Tooltip = ({ text, top, left }) => {
    return (
        <div
            className="absolute bg-gray-900 text-white py-1 px-2 rounded p-1 shadow-md"
            style={{ top, left }}
        >
            {text}
        </div>
    );
};

const Histogram = () => {
    // State to store the data
    const [data, setData] = useState([]);
    const [tooltip, setTooltip] = useState(null);

    // State to track the hover state for each bar
    const [hoveredBar, setHoveredBar] = useState(null);

    // State to track whether data is generated
    const [dataGenerated, setDataGenerated] = useState(false);

    // Function to fetch and regenerate data
    const regenerateData = () => {
        // You can make an API request here to fetch new data or generate random data
        // For the sake of this example, we'll generate random data
        const randomData = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100));
        setData(randomData);
        setDataGenerated(true);
    };

    // Initial data (can be empty)
    const initialData = [];

    // Determine the number of bins or categories
    const numBins = 10; // Adjust as needed

    // Calculate bin width and set up bins
    const binWidth = dataGenerated ? 100 / numBins : 0;
    const bins = Array.from({ length: numBins }, (_, i) => ({
        start: dataGenerated ? i * binWidth : 0,
        end: dataGenerated ? (i + 1) * binWidth : 0,
        count: 0,
    }));

    // Fill the bins with data counts
    data.forEach((value) => {
        const binIndex = Math.floor((value / 100) * numBins);
        if (binIndex >= 0 && binIndex < numBins) {
            bins[binIndex].count++;
        }
    });

    // Find the maximum count for scaling
    const maxCount = Math.max(...bins.map((bin) => bin.count));

    return (
        <div className="flex mt-32 flex-col items-center h-screen">
            <div className="max-w-full bg-white rounded-lg shadow p-4 md:p-6 relative">
                <div className="pb-4 mb-4">
                    <div className="grid grid-cols-10 gap-2">
                        {bins.map((bin, index) => (
                            <div
                                key={index}
                                className="relative mt-16"
                            >
                                <div
                                    className="absolute bottom-0 left-0 right-0 cursor-pointer"
                                    style={{
                                        height: `${20 + (bin.count / maxCount) * (100 - 20)}px`, // Update this line
                                        minHeight: '0px',
                                        background: hoveredBar === index ? 'rgba(255, 99, 132, 0.5)' : 'rgba(53, 162, 235, 0.5)',
                                    }}
                                    onMouseEnter={() => setHoveredBar(index)}
                                    onMouseLeave={() => setHoveredBar(null)}
                                >
                                    
                                    {hoveredBar === index && (
                                        <Tooltip
                                            text={`${bin.count}`}
                                            top={-20} // Adjust the position as needed
                                            left={0} // Adjust the position as needed
                                        />
                                    )}
                                </div>
                                <div className="text-center mt-2 relative text-white opacity-0">
                                    ({bin.start.toFixed(2)} - {bin.end.toFixed(2)})
                                </div>
                            </div>
                        ))}

                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gray-600"></div>
                    <div className="absolute bottom-0 left-0 w-px h-full bg-gray-600"></div>
                    {Array.from({ length: numBins }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute top-52 bottom-0 left-0"
                            style={{
                                left: `${i * (100 / numBins)}%`,
                                transform: 'translateX(-50%)',
                            }}
                        >
                            <div className="text-center text-gray-600">
                                {(i / numBins).toFixed(2)}
                            </div>
                        </div>
                    ))}
                    <div className="absolute -left-14 top-16 bottom-0 transform translateX(-50%) translatey(-50%)">
                        <div className="text-center transform rotate-90 mt-2  text-gray-600">
                            Frequency
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center mt-16">
                <button
                    onClick={regenerateData}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover-bg-blue-600"
                >
                    Regenerate Data
                </button>
            </div>
        </div>

    );
};

export default Histogram;
