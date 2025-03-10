import React, { useState, useEffect, useMemo } from "react";
import { format, parseISO, isAfter, formatDistanceToNow } from "date-fns";
import {
  CalendarPlus,
  Users,
  Lock,
  Unlock,
  XCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationEllipsis,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import ScheduledMeetingForm from "@/components/Forms/ScheduledMeetingForm";
import JoinMeetingForm from "@/components/Forms/JoinMeetingForm";
import { useGetRooms } from "@/adapters/Requests";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const ITEMS_PER_PAGE = 5;

const DashboardView = () => {
  const [dismissedMeetings, setDismissedMeetings] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [filterHost, setFilterHost] = useState("all");
  const [filterPrivacy, setFilterPrivacy] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getRooms = useGetRooms();
  const { getUser } = useAuth();

  const filteredMeetings = useMemo(() => {
    return getRooms?.data
      ?.filter((meeting) => isAfter(parseISO(meeting.opens_at), new Date()))
      .filter(
        (meeting) =>
          filterHost === "all" ||
          (filterHost === "you" && meeting.created_by === getUser?.user_uid) ||
          (filterHost === "others" && meeting.created_by !== getUser?.user_uid),
      )
      .filter(
        (meeting) =>
          filterPrivacy === "all" ||
          (filterPrivacy === "private" && meeting.public) ||
          (filterPrivacy === "public" && !meeting.public),
      )
      .filter((meeting) =>
        meeting.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort(
        (a, b) =>
          new Date(a.opens_at).getTime() - new Date(b.opens_at).getTime(),
      );
  }, [getRooms?.data, filterHost, filterPrivacy, searchTerm, getUser]);

  const totalPages = useMemo(
    () => Math.ceil((filteredMeetings?.length || 0) / ITEMS_PER_PAGE),
    [filteredMeetings],
  );

  const paginatedMeetings = useMemo(
    () =>
      filteredMeetings?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [filteredMeetings, currentPage],
  );

  const activeMeetings = useMemo(
    () =>
      getRooms?.data?.filter(
        (meeting) =>
          isAfter(new Date(), parseISO(meeting.opens_at)) &&
          !dismissedMeetings.has(meeting.rid),
      ),
    [getRooms?.data, dismissedMeetings],
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const closeMeeting = (rid) => {
    setDismissedMeetings((prev) => {
      const newSet = new Set(prev);
      newSet.add(rid);
      return newSet;
    });
  };

  return (
    <div className="container mx-auto p-4">
      {activeMeetings?.length > 0 && (
        <div className="fixed top-0 left-0 right-0 bg-primary/20 bg-opacity-75 p-4 z-50">
          {activeMeetings.map((meeting) => (
            <div key={meeting.rid} className="mb-4 relative">
              <Card>
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle className="text-base">
                    <span className="text-2xl">{meeting.name}</span> started{" "}
                    {formatDistanceToNow(parseISO(meeting.opens_at))} ago
                    <br />
                    <span className="text-sm text-primary/60">
                      {meeting.attendees} are present
                    </span>
                  </CardTitle>
                  <Link to={`/room/${meeting.rid}`}>
                    <Button className="ml-auto">Join Now</Button>
                  </Link>
                </CardHeader>
                <XCircle
                  onClick={() => closeMeeting(meeting.rid)}
                  className="absolute top-0 right-0 h-6 w-6 hover:stroke-destructive cursor-pointer"
                />
              </Card>
            </div>
          ))}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Meeting Dashboard</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col lg:flex-row space-x-0 space-y-2 lg:space-x-2 lg:space-y-0">
          <ScheduledMeetingForm />
          {/* <JoinMeetingForm /> */}
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Input
            placeholder="Search meetings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-40 lg:w-56"
          />
          <Select value={filterHost} onValueChange={setFilterHost}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by host" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Hosts</SelectItem>
              <SelectItem value="you">Your Meetings</SelectItem>
              <SelectItem value="others">Others' Meetings</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPrivacy} onValueChange={setFilterPrivacy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by privacy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Meetings</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {paginatedMeetings?.length === 0 && (
        <div className="text-center text-6xl text-primary/60 mt-20">
          You have no scheduled meetings
        </div>
      )}

      {paginatedMeetings?.map((meeting) => (
        <Card key={meeting.rid} className="mb-4">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{meeting.name}</span>
              <Badge variant={meeting.public ? "secondary" : "outline"}>
                {meeting.public ? (
                  <Unlock className="h-3 w-3 mr-1" />
                ) : (
                  <Lock className="h-3 w-3 mr-1" />
                )}
                {meeting.public ? "Public" : "Private"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Date: {format(parseISO(meeting.opens_at), "MMMM d, yyyy HH:mm")}
            </p>
            <p>Host: {meeting.created_by_email}</p>
            <p>
              <Users className="inline mr-2 h-4 w-4" />
              {meeting.attendees} known attendees
            </p>
          </CardContent>
        </Card>
      ))}

      {filteredMeetings?.length > ITEMS_PER_PAGE && (
        <Pagination
          total={filteredMeetings.length}
          siblingCount={1}
          itemsPerPage={ITEMS_PER_PAGE}
          showEdges
          defaultPage={currentPage}
          className="flex justify-center mx-auto"
        >
          <PaginationContent className="flex items-center gap-1">
            {({ items }) => (
              <>
                <PaginationItem onClick={() => handlePageChange(1)}>
                  <ChevronLeft />
                </PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                />

                {items.map((item, index) => {
                  if (item.type === "page") {
                    return (
                      <PaginationItem key={index} value={item.value} asChild>
                        <Button
                          className="w-10 h-10 p-0"
                          variant={
                            item.value === currentPage ? "default" : "outline"
                          }
                          onClick={() => handlePageChange(item.value)}
                        >
                          {item.value}
                        </Button>
                      </PaginationItem>
                    );
                  } else {
                    return (
                      <PaginationEllipsis
                        key={`ellipsis-${index}`}
                        index={index}
                      />
                    );
                  }
                })}

                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                />
                <PaginationItem onClick={() => handlePageChange(totalPages)}>
                  <ChevronRight />
                </PaginationItem>
              </>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default DashboardView;
