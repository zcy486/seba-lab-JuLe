from sqlalchemy import Column, Integer, String
from db import Base

class Statistic(Base):
    __tablename__ = 'statistic_types'
    id = Column(Integer, primary_key=True)
    title = Column(String(50), unique=True)
    description = Column(String(140), unique=False)
    
    def __init__(self, title, description):
        self.title = title
        self.description = description

    def __repr__(self):
        return f'<Statistic {self.title!r}>'