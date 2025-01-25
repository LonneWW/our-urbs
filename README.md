<a name="readme-top"></a>

<br />
<div align="center">

<h1 align="center">OurUrbs</h1>

![Website Preview][website-preview-users]

[For the app, click here.](https://our-urbs.netlify.app)

  <p align="center">
    This project is one of the the pratical exams of the Angular <a href="https://www.start2impact.it"> start2impact University's </a> course. </br>
    The task was to create a fake app using the <a href="https://gorest.co.in">Go REST API</a> service.
    Mine is a social-like app, for people who wants to share ideas and reports to improve life in urban centers.
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#project-structure">Project Structure</a></li>
        <li><a href="#setting-up">Setting Up</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#flaws">Flaws</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#feedbacks">Feedbacks</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

### Project Structure

```
our-urbs/
├── src/
│   ├── app/
│   │   ├── assets/          # Static files
│   │   ├── components/      # Components
│   │   ├── guards/          # Route Guards
│   │   ├── interceptors/    # Interceptors
│   │   ├── interfaces/      # Interfaces
│   │   ├── services/        # Services
│   ├── environments/        # Environment Configuration
├── angular.json             # Angular Configuration
├── package.json             # Dependences and npm scripts
└── tsconfig.json            # TypeScript Configuration
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Setting up

The project was developed with Angular 19.

<ol>
  <li>
    Clone the repository:
    
    git clone https://github.com/LonneWW/our-urbs.git
  </li>
  <li>
    Change directory to the project one:
    
    cd our-urbs
  </li>
  <li>
    Install packages:
    
    npm install
  </li>
  <li>
    Run the development server and try the app:
    
    ng serve
  </li>
</ol>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![ANGULAR][angular-badge]][angular-url]
- [![TS][typescript-badge]][typescript-url]
- [![HTML5][html-badge]][html-url]
- [![SASS][sass-badge]][sass-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

In order to use the application you'll need to obtain an access token via <a href="https://gorest.co.in/consumer/login">this link</a>. </br>
Then, you can create your profile using your name, email, gender and access token. Once your user is created successfully, you can later login by providing only your token. </br>
You can navigate the application using the buttons on the right side of the nav-bar (or log-out, by clicking the last one). </br>
The first page you'll see is the list of all the users already signed in. Here you can search users by name or email. </br>
If you click on one of the shown users, you'll be redirected to their personal profile. Here you can see this user's details and posts, if available. </br>
You can visit your own profile by clicking on the "Profile" button. Here you can modify your credentials, edit your posts or delete your account.</br>
By clicking the "Forum" button the app will show all the posts recently uploaded. Here you can search posts by title, create one of your own or comment the others. </br>
</br>
Also, if any error with your profile occurs, you can recover your data using your email and token in the section "Recover User Data", in the register page. </br>

![Website Preview][website-preview-posts]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FLAWS -->

## Flaws

Since it's a project and not a real app, I've decided to leave some flaws in order to not get stuck trying to make everything perfect.
Here, a small list:

<ol>
  <li>
    The "Create your own post" should have been a separate component. This way I could have easily put it in the profile page of the logged in user.
  </li>
  <li>
    For testing purposes I've added some optional chaining in some html files which will give you some warnings when running the development server. It's my first time testing an Angular application (actually, developing one) and I don't really know what I could have done better. I didn't like the idea of adding lots of getters for the tests files to access the components' properties, so I've just made public a bunch. If you know better, I'll be grateful. 
  </li>
  <li>
    The documentation does not follow a precise structure. This is because I've generated some, others I did not like and I modified, still others I wrote them directly. This may be confusing when reading the code for the first time.
  </li>
  <li>
    I'm not really satisfied of what it looks. The general sizing isn't great, the choice of colors either, the mobile's design responsiveness is a bit of a mess... I know it wasn't the point of the project, but I know I've could have done better. Next time I definitely will.
  </li>
</ol>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

- [![Website Portfolio][site-badge]][site-url]
- [![LinkedIn][linkedin-shield]][linkedin-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FEEDBACKS -->

## Feedbacks

If you'd like to spend some of your time to tell me what you think about it or maybe give me some hints to how you would have done things different, I'll be very, very grateful.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[angular-badge]: https://img.shields.io/badge/Angular-white?style=flat&logo=angular&logoColor=purple
[angular-url]: https://angular.dev
[typescript-badge]: https://img.shields.io/badge/Typescript-white?style=flat&logo=typescript&logoColor=%233178C6

[typescript-url]: https://angular.dev](https://www.typescriptlang.org
[html-badge]: https://img.shields.io/badge/HTML-white?style=flat&logo=html5&logoColor=%23E34F26
[html-url]: https://html.it
[sass-badge]: https://img.shields.io/badge/SASS-white?style=flat&logo=sass&logoColor=%23CC6699
[sass-url]: https://sass-lang.com
[site-badge]: https://img.shields.io/badge/Website-grey?style=flat
[site-url]: https://lonneww.github.io/portfolio/
[linkedin-shield]: https://img.shields.io/badge/Linkedin-grey?style=flat&logo=linkedin&logoColor=%230A66C2
[linkedin-url]: https://www.linkedin.com/in/samuel-barbieri-100886208/

[website-preview-register]: src/app/assets/Website-Preview-Register.png
[website-preview-users]: src/app/assets/Website-Preview-Users.png
[website-preview-posts]: src/app/assets/Website-Preview-Posts.png
