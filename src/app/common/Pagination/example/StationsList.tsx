import React, { useState, useEffect } from 'react';
import {
  ListStationsResponsePagination,
  StationItemWithSummary,
} from '@upstream/upstream-api';
import PaginatedList from './PaginatedList';

// Example component that displays a list of stations with pagination
const StationsList: React.FC = () => {
  const [stationsData, setStationsData] =
    useState<ListStationsResponsePagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch stations data
  const fetchStations = async (page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // Replace this with your actual API call
      // const response = await stationsApi.listStations({ page, size: 10 });
      // setStationsData(response);

      // For demonstration, using mock data
      const mockData: ListStationsResponsePagination = {
        items: [
          {
            id: 1,
            name: 'Station 1',
            sensorCount: 5,
            sensorTypes: ['temperature', 'humidity'],
            sensorVariables: ['temp', 'hum'],
          } as StationItemWithSummary,
          {
            id: 2,
            name: 'Station 2',
            sensorCount: 3,
            sensorTypes: ['pressure'],
            sensorVariables: ['press'],
          } as StationItemWithSummary,
        ],
        total: 20,
        page: page,
        size: 10,
        pages: 2,
      };

      setStationsData(mockData);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch stations'),
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchStations(1);
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchStations(page);
  };

  // Render a single station item
  const renderStation = (station: StationItemWithSummary) => {
    return (
      <div className="p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg font-medium">{station.name}</h3>
        <p className="text-gray-500">ID: {station.id}</p>
        <p className="text-gray-500">Sensors: {station.sensorCount}</p>
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading stations...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!stationsData) {
    return <div>No stations data available</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Stations</h2>

      <PaginatedList
        data={stationsData}
        onPageChange={handlePageChange}
        renderItem={renderStation}
        className="space-y-4"
      />
    </div>
  );
};

export default StationsList;
