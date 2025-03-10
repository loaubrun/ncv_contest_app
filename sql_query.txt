SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `local_ncv`
--

-- --------------------------------------------------------

--
-- Structure de la table `bloc`
--

CREATE TABLE `bloc` (
  `blocId` int(11) NOT NULL,
  `blocName` varchar(255) DEFAULT NULL,
  `photoName` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `juged` int(11) DEFAULT NULL,
  `zone` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `bloc`
--

INSERT INTO `bloc` (`blocId`, `blocName`, `photoName`, `color`, `juged`, `zone`) VALUES
(5, 'Bloc 5', '/uploads/1741188343462.png', 'Blanc', 0, '1'),
(6, 'Bloc 6', '/uploads/1741188345268.png', 'Blanc', 0, '2'),
(7, 'Bloc 1', 'hs', 'Red', 1, '3'),
(8, 'Bloc 17', '/uploads/1741430954562.png', 'Blanc', 0, '3'),
(9, 'Bloc 12', '/uploads/1741431273455.png', 'Jaune', 0, '4');

-- --------------------------------------------------------

--
-- Structure de la table `climber`
--

CREATE TABLE `climber` (
  `climberId` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `mail` varchar(255) DEFAULT NULL,
  `sexe` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `climber`
--

INSERT INTO `climber` (`climberId`, `name`, `mail`, `sexe`) VALUES
(1, 'Alex', 'alex@example.com', 'H'),
(2, 'Tristan', 'tristan.garcia-marcandelli@student-cs.fr', 'H'),
(3, 'Louis', 't@b', 'H'),
(4, 'Theo', 't@o', 'H'),
(5, 'Yasser', 'yass@yass', 'H'),
(6, 'Malo', 'fzj@p', 'H'),
(7, 'Oscar', 'O@b', 'H'),
(8, 'Le goat', 'f@nb', 'H'),
(9, 'FEMME 1', 'f@nb', 'F');

-- --------------------------------------------------------

--
-- Structure de la table `perf_bloc`
--

CREATE TABLE `perfBloc` (
  `climberId` int(11) NOT NULL,
  `blocId` int(11) NOT NULL,
  `zone` int(11) DEFAULT NULL,
  `essaisZone` int(11) DEFAULT NULL,
  `top` int(11) DEFAULT NULL,
  `essaisTop` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `perf_bloc`
--

INSERT INTO `perfBloc` (`climberId`, `blocId`, `zone`, `essaisZone`, `top`, `essaisTop`) VALUES
(2, 5, 1, 0, 1, 0),
(2, 7, 1, 0, 1, 0),
(9, 5, 1, 0, 1, 0),
(9, 6, 1, 0, 1, 0);

-- --------------------------------------------------------

--
-- Structure de la table `perfVoie`
--

CREATE TABLE `perfVoie` (
  `climberId` int(11) NOT NULL,
  `voieId` int(11) NOT NULL,
  `maxDegaine` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `voie`
--

CREATE TABLE `voie` (
  `voieId` int(11) NOT NULL,
  `nameId` varchar(255) DEFAULT NULL,
  `photoName` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `difficulty` varchar(255) DEFAULT NULL,
  `juged` int(11) DEFAULT NULL,
  `nbDegaine` int(11) DEFAULT NULL,
  `zone` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `bloc`
--
ALTER TABLE `bloc`
  ADD PRIMARY KEY (`blocId`);

--
-- Index pour la table `climber`
--
ALTER TABLE `climber`
  ADD PRIMARY KEY (`climberId`);

--
-- Index pour la table `perfBloc`
--
ALTER TABLE `perfBloc`
  ADD PRIMARY KEY (`climberId`,`blocId`),
  ADD KEY `bloc_id` (`blocId`);

--
-- Index pour la table `perfVoie`
--
ALTER TABLE `perfVoie`
  ADD PRIMARY KEY (`climberId`,`voieId`),
  ADD KEY `voie_id` (`voieId`);

--
-- Index pour la table `voie`
--
ALTER TABLE `voie`
  ADD PRIMARY KEY (`voieId`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `bloc`
--
ALTER TABLE `bloc`
  MODIFY `blocId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `climber`
--
ALTER TABLE `climber`
  MODIFY `climberId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `perfVoie`
--
ALTER TABLE `perfVoie`
  MODIFY `voieId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `voie`
--
ALTER TABLE `voie`
  MODIFY `voieId` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `perfBloc`
--
ALTER TABLE `perfBloc`
  ADD CONSTRAINT `perfBloc_ibfk_1` FOREIGN KEY (`climberId`) REFERENCES `climber` (`climberId`),
  ADD CONSTRAINT `perfBloc_ibfk_2` FOREIGN KEY (`blocId`) REFERENCES `bloc` (`blocId`);

--
-- Contraintes pour la table `perfVoie`
--
ALTER TABLE `perf_voie`
  ADD CONSTRAINT `perfVoie_ibfk_1` FOREIGN KEY (`climberId`) REFERENCES `climber` (`climberId`),
  ADD CONSTRAINT `perfVoie_ibfk_2` FOREIGN KEY (`voieId`) REFERENCES `voie` (`voieId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
