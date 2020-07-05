# Shoodoo Status Page

A status page solution for Shoodoo Analytics Ltd.

A status page that monitors all the GET requests sent to the company’s API server enabling prompt detection of system bugs. I implemented this by storing every GET endpoint in a database table and implementing a poller that would call each of the endpoints after a specified time interval. If the poller encounters an error while calling an endpoint, the server would store the endpoint, the error message, and the initial timestamp of the error in a separate table. And if the same endpoint fails, it would update the current timestamp of the error. After the error is resolved, the server updated the closing timestamp of the error. 

Finally, I built a status page website to visualize the status of the website and the API server using HTML, CSS, JavaScript, and JQuery. This website would be rolled out for viewing by the customers to keep them up to date with the company’s system status while fostering transparency and accountability between the company and the customers.
