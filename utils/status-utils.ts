export const getStatusColor = (status: string | number): string => {
    // If status is a number, convert it to string
    const statusStr = typeof status === 'number' 
        ? ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'][status] 
        : status.toUpperCase();  // Convert to uppercase to match our cases
    
    let color = "bg-gray-600"; // default color
    
    switch (statusStr) {
        case "COMPLETED":
            color = "bg-green-600";
            break;
        case "PROCESSING":
            color = "bg-blue-600";
            break;
        case "PENDING":
            color = "bg-yellow-500";
            break;
        case "CANCELLED":
            color = "bg-red-600";
            break;
    }
    
    return color;
}