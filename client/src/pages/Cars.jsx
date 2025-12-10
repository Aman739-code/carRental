/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets, dummyCarData } from "../assets/assets";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Cars = () => {
  // Getting search params from url
  const [searchParams, setSearchParams] = useSearchParams();
  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");
  const isSearchData = pickupLocation && pickupDate && returnDate;
  const [filteredCars, setFilteredCars] = useState([]);
  // initialize from URL so filters persist
  const initPage = parseInt(searchParams.get("page")) || 1;
  const initLimit = parseInt(searchParams.get("limit")) || 9;
  const initSortBy = searchParams.get("sortBy") || "createdAt";
  const initSortOrder = searchParams.get("sortOrder") || "desc";
  const initCategory = searchParams.get("category") || "";
  const initQ = searchParams.get("q") || "";

  const [page, setPage] = useState(initPage);
  const [limit, setLimit] = useState(initLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState(initSortBy);
  const [sortOrder, setSortOrder] = useState(initSortOrder);
  const [categoryFilter, setCategoryFilter] = useState(initCategory);
  const [debouncedInput, setDebouncedInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { cars, axios } = useAppContext();

  const [input, setInput] = useState(initQ);

  const applyFilter = async () => {
    // trigger search via backend; reset to page 1
    setPage(1);
    setDebouncedInput(input);
    await fetchCarsFromBackend({
      page: 1,
      limit,
      sortBy,
      sortOrder,
      category: categoryFilter,
      q: input,
    });
  };

  const searchCarAvailability = async () => {
    try {
      const response = await axios.post("/api/bookings/check-availability", {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });
      if (response.status === 200 && response.data && response.data.success) {
        setFilteredCars(response.data.availableCars);
        if (response.data.availableCars.length === 0)
          toast("No cars available");
        return null;
      } else {
        const message =
          response?.data?.message || "Failed to check availability";
        toast.error(message);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Failed to check availability";
      toast.error(message);
    }
  };

  // fetch cars from backend with query options
  const fetchCarsFromBackend = async ({
    page = 1,
    limit = 9,
    sortBy = "createdAt",
    sortOrder = "desc",
    category,
    q,
  } = {}) => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit, sortBy, sortOrder };
      if (category) params.category = category;
      if (q) params.q = q;
      const response = await axios.get("/api/user/cars", { params });
      if (response.status === 200 && response.data && response.data.success) {
        setFilteredCars(response.data.cars);
        setPage(response.data.pagination.page || page);
        setTotalPages(response.data.pagination.totalPages || 1);
        // sync filters to URL
        try {
          const newParams = new URLSearchParams(searchParams);
          newParams.set("page", String(response.data.pagination.page || page));
          newParams.set("limit", String(limit));
          newParams.set("sortBy", sortBy);
          newParams.set("sortOrder", sortOrder);
          if (category) newParams.set("category", category);
          else newParams.delete("category");
          if (q) newParams.set("q", q);
          else newParams.delete("q");
          setSearchParams(newParams);
        } catch (e) {
          // ignore URL syncing errors
        }
      } else {
        const msg = response?.data?.message || "Failed to load cars";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Failed to load cars";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // debounce input -> debouncedInput
  useEffect(() => {
    const t = setTimeout(() => setDebouncedInput(input), 300);
    return () => clearTimeout(t);
  }, [input]);

  // main fetch effect: run when relevant params change
  useEffect(() => {
    if (isSearchData) {
      searchCarAvailability();
      return;
    }
    fetchCarsFromBackend({
      page,
      limit,
      sortBy,
      sortOrder,
      category: categoryFilter,
      q: debouncedInput,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    limit,
    sortBy,
    sortOrder,
    categoryFilter,
    debouncedInput,
    isSearchData,
  ]);
  return (
    <div>
      <div className="flex flex-col items-center py-20 bg-light max-md:px-4">
        <Title
          title="Available Cars"
          subTitle="Browse our selection of premium vehicles available for your next adventure"
        />
        <div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 mr-2" />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search"
            className="w-full h-full outline-none text-gray-500"
          />
          <button
            onClick={() =>
              fetchCarsFromBackend({
                page: 1,
                limit,
                sortBy,
                sortOrder,
                category: categoryFilter,
                q: input,
              })
            }
            className="ml-2 px-3 py-1 bg-primary text-white rounded"
          >
            Search
          </button>
          <img src={assets.filter_icon} alt="" className="w-4.5 h-4.5 ml-2" />
        </div>
        <div className="flex items-center gap-4 mt-4 max-w-140 w-full">
          <select
            value={categoryFilter}
            onChange={(e) => {
              const v = e.target.value;
              setCategoryFilter(v);
              setPage(1);
              // immediately fetch with new category
              fetchCarsFromBackend({
                page: 1,
                limit,
                sortBy,
                sortOrder,
                category: v,
                q: input || debouncedInput,
              });
            }}
            className="p-2 border rounded"
          >
            <option value="">All categories</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="van">Van</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => {
              const v = e.target.value;
              setSortBy(v);
              setPage(1);
              fetchCarsFromBackend({
                page: 1,
                limit,
                sortBy: v,
                sortOrder,
                category: categoryFilter,
                q: input || debouncedInput,
              });
            }}
            className="p-2 border rounded"
          >
            <option value="createdAt">Newest</option>
            <option value="pricePerDay">Price</option>
            <option value="year">Year</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => {
              const v = e.target.value;
              setSortOrder(v);
              setPage(1);
              fetchCarsFromBackend({
                page: 1,
                limit,
                sortBy,
                sortOrder: v,
                category: categoryFilter,
                q: input || debouncedInput,
              });
            }}
            className="p-2 border rounded"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>

      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto ">
          Showing {filteredCars.length} Cars
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
          {filteredCars.map((car, index) => (
            <div key={index}>
              <CarCard car={car} />
            </div>
          ))}
        </div>
        {/* Loading / No results / Error */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="mb-2 text-red-600">{error}</div>
            <button
              onClick={() =>
                fetchCarsFromBackend({
                  page,
                  limit,
                  sortBy,
                  sortOrder,
                  category: categoryFilter,
                  q: input,
                })
              }
              className="px-3 py-1 bg-primary text-white rounded"
            >
              Retry
            </button>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-2">No cars found</div>
            <button
              onClick={() =>
                fetchCarsFromBackend({
                  page,
                  limit,
                  sortBy,
                  sortOrder,
                  category: categoryFilter,
                  q: input,
                })
              }
              className="px-3 py-1 bg-primary text-white rounded"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="flex justify-center gap-2 mt-6">
            <button
              disabled={page <= 1}
              onClick={() => {
                const p = Math.max(1, page - 1);
                setPage(p);
              }}
              className="px-3 py-1 bg-white border rounded"
            >
              Prev
            </button>
            <div className="px-3 py-1 border rounded">
              Page {page} / {totalPages}
            </div>
            <button
              disabled={page >= totalPages}
              onClick={() => {
                const p = Math.min(totalPages, page + 1);
                setPage(p);
              }}
              className="px-3 py-1 bg-white border rounded"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;
