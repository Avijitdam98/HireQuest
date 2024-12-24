import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Badge,
  HStack,
  VStack,
  Avatar,
  Divider,
  useToast,
  useColorModeValue,
  Skeleton
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaBriefcase, FaDollarSign, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import useJobStore from '../../store/useJobStore';
import useAuthStore from '../../store/useAuthStore';
import RecommendationCard from '../recommendations/RecommendationCard';

const JobDetailPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const { user } = useAuthStore();
  const { 
    getJob,
    applyForJob,
    toggleSaveJob,
    savedJobs,
    getSimilarJobs,
    loading 
  } = useJobStore();

  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const jobData = await getJob(jobId);
      setJob(jobData);
      const similar = await getSimilarJobs(jobId);
      setSimilarJobs(similar);
    };
    fetchData();
  }, [jobId]);

  const handleApply = async () => {
    try {
      setApplying(true);
      await applyForJob(jobId);
      toast({
        title: 'Application Submitted',
        description: 'Your application has been successfully submitted.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/applications');
    } catch (error) {
      toast({
        title: 'Application Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading || !job) {
    return (
      <Container maxW="container.xl" py={8}>
        <Grid templateColumns="repeat(12, 1fr)" gap={8}>
          <GridItem colSpan={{ base: 12, lg: 8 }}>
            <Skeleton height="200px" mb={4} />
            <Skeleton height="100px" mb={4} />
            <Skeleton height="300px" />
          </GridItem>
          <GridItem colSpan={{ base: 12, lg: 4 }}>
            <Skeleton height="400px" />
          </GridItem>
        </Grid>
      </Container>
    );
  }

  const isSaved = savedJobs.includes(jobId);

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns="repeat(12, 1fr)" gap={8}>
        <GridItem colSpan={{ base: 12, lg: 8 }}>
          {/* Job Header */}
          <Box
            p={6}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
            mb={6}
          >
            <HStack spacing={6} align="start">
              <Avatar
                size="xl"
                name={job.company}
                src={job.company_logo}
              />
              <Box flex="1">
                <Heading size="lg" mb={2}>{job.title}</Heading>
                <Text color="gray.600" fontSize="lg" mb={4}>{job.company}</Text>
                
                <HStack spacing={6} mb={4}>
                  <HStack>
                    <FaMapMarkerAlt />
                    <Text>{job.location}</Text>
                  </HStack>
                  <HStack>
                    <FaBriefcase />
                    <Text>{job.type}</Text>
                  </HStack>
                  <HStack>
                    <FaDollarSign />
                    <Text>${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}</Text>
                  </HStack>
                </HStack>

                <HStack spacing={4}>
                  <Button
                    colorScheme="blue"
                    size="lg"
                    onClick={handleApply}
                    isLoading={applying}
                  >
                    Apply Now
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => toggleSaveJob(jobId)}
                    leftIcon={isSaved ? <FaBookmark /> : <FaRegBookmark />}
                  >
                    {isSaved ? 'Saved' : 'Save Job'}
                  </Button>
                </HStack>
              </Box>
            </HStack>
          </Box>

          {/* Job Details */}
          <Box
            p={6}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
            mb={6}
          >
            <VStack align="stretch" spacing={6}>
              <Box>
                <Heading size="md" mb={4}>About the Role</Heading>
                <Text whiteSpace="pre-wrap">{job.description}</Text>
              </Box>

              <Divider />

              <Box>
                <Heading size="md" mb={4}>Required Skills</Heading>
                <HStack spacing={2} flexWrap="wrap">
                  {job.required_skills?.map((skill) => (
                    <Badge key={skill} colorScheme="blue" px={3} py={1}>
                      {skill}
                    </Badge>
                  ))}
                </HStack>
              </Box>

              <Divider />

              <Box>
                <Heading size="md" mb={4}>Preferred Skills</Heading>
                <HStack spacing={2} flexWrap="wrap">
                  {job.preferred_skills?.map((skill) => (
                    <Badge key={skill} colorScheme="green" px={3} py={1}>
                      {skill}
                    </Badge>
                  ))}
                </HStack>
              </Box>

              {job.benefits && (
                <>
                  <Divider />
                  <Box>
                    <Heading size="md" mb={4}>Benefits</Heading>
                    <VStack align="start" spacing={2}>
                      {job.benefits.map((benefit, index) => (
                        <Text key={index}>• {benefit}</Text>
                      ))}
                    </VStack>
                  </Box>
                </>
              )}
            </VStack>
          </Box>

          {/* Company Details */}
          <Box
            p={6}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
          >
            <Heading size="md" mb={4}>About {job.company}</Heading>
            <Text mb={4}>{job.company_description}</Text>
            
            <HStack spacing={6} mt={4}>
              <Box>
                <Text fontWeight="bold">Industry</Text>
                <Text>{job.industry}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Company Size</Text>
                <Text>{job.company_size}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Founded</Text>
                <Text>{job.founded_year}</Text>
              </Box>
            </HStack>
          </Box>
        </GridItem>

        {/* Sidebar */}
        <GridItem colSpan={{ base: 12, lg: 4 }}>
          <Box
            p={6}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
            mb={6}
          >
            <Heading size="md" mb={4}>Similar Jobs</Heading>
            <VStack spacing={4}>
              {similarJobs.map((job) => (
                <RecommendationCard
                  key={job.id}
                  item={{ ...job, type: 'job' }}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                />
              ))}
            </VStack>
          </Box>

          {job.match_score && (
            <Box
              p={6}
              bg={bgColor}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="sm"
            >
              <Heading size="md" mb={4}>Match Analysis</Heading>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text>Overall Match</Text>
                    <Badge colorScheme="green" fontSize="md">
                      {job.match_score}%
                    </Badge>
                  </HStack>
                  <Progress
                    value={job.match_score}
                    colorScheme="green"
                    borderRadius="full"
                  />
                </Box>

                {job.match_reasons && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>Why You Match</Text>
                    <VStack align="start" spacing={2}>
                      {job.match_reasons.map((reason, index) => (
                        <Text key={index} fontSize="sm">• {reason}</Text>
                      ))}
                    </VStack>
                  </Box>
                )}

                {job.missing_skills && job.missing_skills.length > 0 && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>Skills to Develop</Text>
                    <HStack spacing={2} flexWrap="wrap">
                      {job.missing_skills.map((skill) => (
                        <Badge key={skill} colorScheme="red">
                          {skill}
                        </Badge>
                      ))}
                    </HStack>
                  </Box>
                )}
              </VStack>
            </Box>
          )}
        </GridItem>
      </Grid>
    </Container>
  );
};

export default JobDetailPage;
