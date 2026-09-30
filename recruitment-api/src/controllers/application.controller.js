export class ApplicationController {
  constructor(service) {
    this.service = service;
  }

  create = async (req, res, next) => {
    try {
      const application = await this.service.create(req.body);
      res.status(201).json(application);
    } catch (error) {
      next(error);
    }
  };

  list = async (req, res, next) => {
    try {
      const applications = await this.service.list(req.query);
      res.status(200).json(applications);
    } catch (error) {
      next(error);
    }
  };

  changeStatus = async (req, res, next) => {
    try {
      const application = await this.service.changeStatus(
        Number(req.params.id),
        req.body.status
      );
      res.status(200).json(application);
    } catch (error) {
      next(error);
    }
  };
}
