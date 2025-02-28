import React from "react";
import { XCircleIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

const AddParticipant = ({ email, role, removeParticipant }) => {
  return (
    <div className="relative group">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback>
              {email.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
        <Button disabled variant="outline">
          {role || "Participant"}
        </Button>
      </div>
      {removeParticipant && (
        <XCircleIcon
          className="absolute -top-5 -right-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-6 h-6 text-primary"
          onClick={() => removeParticipant(email)}
        />
      )}
    </div>
  );
};

export default AddParticipant;
