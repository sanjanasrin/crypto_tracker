# Crypto Trader

## Architecture Choices and Reasoning

### Introduction

The project aims to build a Single Page Application (SPA) using React to visualize cryptocurrency trading values. The application fetches data from a coinGecko API and presents it in an interactive chart format using ECharts. Users can view trading values and switch between currencies.

### Technology Stack

- **Front End**: React.js, Material-UI, Axios
- **State Management**: React Context API
- **Styling**: MUI

### Key Architectural Decisions

- **Client-Side Routing**: We chose React Router for its robustness ...
- **State Management Choice**: Due to the size of our application, we opted for React Context API ...
- **Data Fetching**: Axios was selected for its simplicity and compatibility ...

### Folder Structure

- **Components**: Contains all React components ...
- **Pages**: Each route is defined in its respective page component ...

### Development Environment

To run this project locally ,type command "npm start"

### Testing and Deployment

- **Testing Frameworks**: We use Jest for unit testing ...
- **CI/CD**: GitHub Actions automates testing and deployment ...

### Future Improvements

- **Optimization**: Implement lazy loading to improve initial load times ...
- **Scaling**: Consider microservices architecture to facilitate easier scaling ...
- **Autentication**: Considering to add user-Based Login.

### Conclusion

Our architecture choices ensure a scalable, maintainable, and performant application, meeting both current and future needs.
