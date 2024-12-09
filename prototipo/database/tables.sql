CREATE TABLE `pumps` (
    `ID`	INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `NomeModelo` VARCHAR(512) NOT NULL,
    `CodigoModelo` VARCHAR(64),
    `Fabricante` VARCHAR(64),
    `Garantia` DATE,
    `LocalOrigem` VARCHAR(32),
    `PressaoMin`	FLOAT,
    `PressaoMax`	FLOAT,
    `TempMin`	FLOAT,
    `TempMax`	FLOAT,
    `NPSHmin`	FLOAT,
    `altura_geometrica` FLOAT,
    `Head_drop_loss`	FLOAT,
    `fluid_type` VARCHAR(30),
    `vazao` FLOAT,
    `submersivel` BOOL
);
