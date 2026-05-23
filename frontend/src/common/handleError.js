import { toast } from "react-toastify";

const handleResponseError = (response) => {

    // Not Logged In
    if (response.status === 401) {

        toast.error(
            "Please login first"
        );

        return;
    }

    // Forbidden
    if (response.status === 403) {

        toast.error(
            "You don't have permission"
        );

        return;
    }

    // Not Found
    if (response.status === 404) {

        toast.error(
            "Requested resource not found"
        );

        return;
    }

    // Bad Request
    if (response.status === 400) {

        toast.error(
            "Invalid request"
        );

        return;
    }

    // Server Error
    if (response.status >= 500) {

        toast.error(
            "Server error occurred"
        );

        return;
    }

    // Fallback
    toast.error(
        "Something went wrong"
    );
};

export default handleResponseError;